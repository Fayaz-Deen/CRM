package com.crm.service;

import com.crm.dto.TemplateDto;
import com.crm.entity.MessageTemplate;
import com.crm.repository.MessageTemplateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateService {
    private final MessageTemplateRepository templateRepository;

    public TemplateService(MessageTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public List<TemplateDto.TemplateResponse> getTemplates(String userId) {
        return templateRepository.findByUserId(userId).stream()
                .map(TemplateDto.TemplateResponse::from)
                .collect(Collectors.toList());
    }

    public List<TemplateDto.TemplateResponse> getTemplatesByType(String userId, String type) {
        MessageTemplate.TemplateType templateType = MessageTemplate.TemplateType.valueOf(type.toUpperCase());
        return templateRepository.findByUserIdAndType(userId, templateType).stream()
                .map(TemplateDto.TemplateResponse::from)
                .collect(Collectors.toList());
    }

    public TemplateDto.TemplateResponse getTemplate(String userId, String templateId) {
        MessageTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        if (!template.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return TemplateDto.TemplateResponse.from(template);
    }

    @Transactional
    public TemplateDto.TemplateResponse createTemplate(String userId, TemplateDto dto) {
        MessageTemplate template = new MessageTemplate();
        template.setUserId(userId);
        template.setName(dto.getName());
        template.setType(MessageTemplate.TemplateType.valueOf(dto.getType().toUpperCase()));
        template.setContent(dto.getContent());

        template = templateRepository.save(template);
        return TemplateDto.TemplateResponse.from(template);
    }

    @Transactional
    public TemplateDto.TemplateResponse updateTemplate(String userId, String templateId, TemplateDto dto) {
        MessageTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        if (!template.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if (dto.getName() != null) {
            template.setName(dto.getName());
        }
        if (dto.getType() != null) {
            template.setType(MessageTemplate.TemplateType.valueOf(dto.getType().toUpperCase()));
        }
        if (dto.getContent() != null) {
            template.setContent(dto.getContent());
        }

        template = templateRepository.save(template);
        return TemplateDto.TemplateResponse.from(template);
    }

    @Transactional
    public void deleteTemplate(String userId, String templateId) {
        MessageTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        if (!template.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        templateRepository.delete(template);
    }

    @Transactional
    public void createDefaultTemplates(String userId) {
        if (!templateRepository.findByUserId(userId).isEmpty()) {
            return;
        }

        MessageTemplate followup = new MessageTemplate();
        followup.setUserId(userId);
        followup.setName("Follow-up");
        followup.setType(MessageTemplate.TemplateType.FOLLOWUP);
        followup.setContent("Hi {name}, I wanted to follow up on our last conversation. How have you been?");
        templateRepository.save(followup);

        MessageTemplate birthday = new MessageTemplate();
        birthday.setUserId(userId);
        birthday.setName("Birthday Wish");
        birthday.setType(MessageTemplate.TemplateType.BIRTHDAY);
        birthday.setContent("Happy Birthday {name}! Wishing you a wonderful day filled with joy and happiness!");
        templateRepository.save(birthday);

        MessageTemplate anniversary = new MessageTemplate();
        anniversary.setUserId(userId);
        anniversary.setName("Anniversary Wish");
        anniversary.setType(MessageTemplate.TemplateType.ANNIVERSARY);
        anniversary.setContent("Happy Anniversary {name}! Wishing you many more years of happiness together!");
        templateRepository.save(anniversary);
    }
}
