package com.crm.dto;

import com.crm.entity.MessageTemplate;

public class TemplateDto {
    private String name;
    private String type;
    private String content;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public static class TemplateResponse {
        private String id;
        private String name;
        private String type;
        private String content;
        private String createdAt;

        public static TemplateResponse from(MessageTemplate template) {
            TemplateResponse response = new TemplateResponse();
            response.id = template.getId();
            response.name = template.getName();
            response.type = template.getType().name();
            response.content = template.getContent();
            response.createdAt = template.getCreatedAt() != null ? template.getCreatedAt().toString() : null;
            return response;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public String getType() { return type; }
        public String getContent() { return content; }
        public String getCreatedAt() { return createdAt; }
    }
}
