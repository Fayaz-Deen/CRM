package com.crm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-memory rate limiting filter.
 * For production with multiple instances, use Redis-based rate limiting.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${app.rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    @Value("${app.rate-limit.enabled:true}")
    private boolean rateLimitEnabled;

    private final Map<String, RateLimitInfo> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!rateLimitEnabled) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIP(request);
        RateLimitInfo rateLimitInfo = requestCounts.compute(clientIp, (key, info) -> {
            if (info == null || info.isExpired()) {
                return new RateLimitInfo(requestsPerMinute);
            }
            return info;
        });

        if (rateLimitInfo.tryAcquire()) {
            response.setHeader("X-RateLimit-Limit", String.valueOf(requestsPerMinute));
            response.setHeader("X-RateLimit-Remaining", String.valueOf(rateLimitInfo.getRemaining()));
            response.setHeader("X-RateLimit-Reset", String.valueOf(rateLimitInfo.getResetTime()));
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests\",\"message\":\"Rate limit exceeded. Please try again later.\"}");
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RateLimitInfo {
        private final AtomicInteger count;
        private final long windowStart;
        private final int limit;
        private static final long WINDOW_SIZE_MS = 60_000; // 1 minute

        RateLimitInfo(int limit) {
            this.count = new AtomicInteger(0);
            this.windowStart = System.currentTimeMillis();
            this.limit = limit;
        }

        boolean isExpired() {
            return System.currentTimeMillis() - windowStart > WINDOW_SIZE_MS;
        }

        boolean tryAcquire() {
            return count.incrementAndGet() <= limit;
        }

        int getRemaining() {
            return Math.max(0, limit - count.get());
        }

        long getResetTime() {
            return windowStart + WINDOW_SIZE_MS;
        }
    }
}
