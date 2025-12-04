package com.crm.controller;

import com.crm.dto.AuthRequest;
import com.crm.dto.AuthResponse;
import com.crm.entity.User;
import com.crm.repository.UserRepository;
import com.crm.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public AuthController(AuthService authService, UserRepository userRepository, ObjectMapper objectMapper) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.refresh(body.get("refreshToken")));
    }

    @GetMapping("/profile")
    public ResponseEntity<AuthResponse.UserDto> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(AuthResponse.UserDto.from(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse.UserDto> updateProfile(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> updates) {
        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("timezone")) user.setTimezone((String) updates.get("timezone"));
        if (updates.containsKey("profilePicture")) user.setProfilePicture((String) updates.get("profilePicture"));
        if (updates.containsKey("settings")) {
            try {
                user.setSettings(objectMapper.writeValueAsString(updates.get("settings")));
            } catch (Exception e) {
                user.setSettings(updates.get("settings").toString());
            }
        }
        return ResponseEntity.ok(AuthResponse.UserDto.from(userRepository.save(user)));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        authService.changePassword(user, body.get("currentPassword"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        authService.initiatePasswordReset(body.get("email"));
        return ResponseEntity.ok(Map.of("message", "If the email exists, a reset link has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        authService.resetPassword(body.get("token"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @DeleteMapping("/account")
    public ResponseEntity<Map<String, String>> deleteAccount(@AuthenticationPrincipal User user) {
        authService.deleteAccount(user);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}
