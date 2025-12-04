package com.crm.repository;

import com.crm.entity.MessageTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageTemplateRepository extends JpaRepository<MessageTemplate, String> {
    List<MessageTemplate> findByUserId(String userId);

    List<MessageTemplate> findByUserIdAndType(String userId, MessageTemplate.TemplateType type);

    void deleteByUserIdAndId(String userId, String id);
}
