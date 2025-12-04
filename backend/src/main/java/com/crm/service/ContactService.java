package com.crm.service;

import com.crm.dto.ContactDto;
import com.crm.entity.Contact;
import com.crm.entity.User;
import com.crm.repository.ContactRepository;
import com.crm.repository.ReminderRepository;
import com.crm.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {
    private final ContactRepository contactRepository;
    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final ReminderService reminderService;
    private final ObjectMapper objectMapper;

    public ContactService(ContactRepository contactRepository, ReminderRepository reminderRepository,
                          UserRepository userRepository, @Lazy ReminderService reminderService,
                          ObjectMapper objectMapper) {
        this.contactRepository = contactRepository;
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
        this.reminderService = reminderService;
        this.objectMapper = objectMapper;
    }

    public List<ContactDto> getAll(String userId) {
        return contactRepository.findByUserId(userId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public ContactDto getById(String id, String userId) {
        Contact contact = contactRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found"));
        if (!contact.getUserId().equals(userId)) throw new RuntimeException("Access denied");
        return toDto(contact);
    }

    @Transactional
    public ContactDto create(ContactDto dto, String userId) {
        Contact contact = toEntity(dto);
        contact.setUserId(userId);
        contact = contactRepository.save(contact);

        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            if (contact.getBirthday() != null) {
                reminderService.createBirthdayReminder(contact, user);
            }
            if (contact.getAnniversary() != null) {
                reminderService.createAnniversaryReminder(contact, user);
            }
        }

        return toDto(contact);
    }

    public ContactDto update(String id, ContactDto dto, String userId) {
        Contact contact = contactRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found"));
        if (!contact.getUserId().equals(userId)) throw new RuntimeException("Access denied");
        updateEntity(contact, dto);
        return toDto(contactRepository.save(contact));
    }

    @Transactional
    public void delete(String id, String userId) {
        Contact contact = contactRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found"));
        if (!contact.getUserId().equals(userId)) throw new RuntimeException("Access denied");
        reminderRepository.deleteByContactId(id);
        contactRepository.delete(contact);
    }

    public List<ContactDto> search(String userId, String query) {
        return contactRepository.findByUserIdAndNameContainingIgnoreCase(userId, query).stream().map(this::toDto).collect(Collectors.toList());
    }

    private ContactDto toDto(Contact c) {
        ContactDto dto = new ContactDto();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setEmails(parseJson(c.getEmails()));
        dto.setPhones(parseJson(c.getPhones()));
        dto.setWhatsappNumber(c.getWhatsappNumber());
        dto.setInstagramHandle(c.getInstagramHandle());
        dto.setCompany(c.getCompany());
        dto.setTags(parseJson(c.getTags()));
        dto.setAddress(c.getAddress());
        dto.setNotes(c.getNotes());
        dto.setBirthday(c.getBirthday() != null ? c.getBirthday().toString() : null);
        dto.setAnniversary(c.getAnniversary() != null ? c.getAnniversary().toString() : null);
        dto.setProfilePicture(c.getProfilePicture());
        dto.setLastContactedAt(c.getLastContactedAt() != null ? c.getLastContactedAt().toString() : null);
        dto.setCreatedAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
        dto.setUpdatedAt(c.getUpdatedAt() != null ? c.getUpdatedAt().toString() : null);
        return dto;
    }

    private Contact toEntity(ContactDto dto) {
        Contact c = new Contact();
        updateEntity(c, dto);
        return c;
    }

    private void updateEntity(Contact c, ContactDto dto) {
        c.setName(dto.getName());
        c.setEmails(toJson(dto.getEmails()));
        c.setPhones(toJson(dto.getPhones()));
        c.setWhatsappNumber(dto.getWhatsappNumber());
        c.setInstagramHandle(dto.getInstagramHandle());
        c.setCompany(dto.getCompany());
        c.setTags(toJson(dto.getTags()));
        c.setAddress(dto.getAddress());
        c.setNotes(dto.getNotes());
        c.setBirthday(dto.getBirthday() != null && !dto.getBirthday().isEmpty() ? LocalDate.parse(dto.getBirthday()) : null);
        c.setAnniversary(dto.getAnniversary() != null && !dto.getAnniversary().isEmpty() ? LocalDate.parse(dto.getAnniversary()) : null);
        c.setProfilePicture(dto.getProfilePicture());
        if (dto.getLastContactedAt() != null) c.setLastContactedAt(LocalDateTime.parse(dto.getLastContactedAt()));
    }

    private String toJson(List<String> list) {
        try { return list != null ? objectMapper.writeValueAsString(list) : "[]"; }
        catch (JsonProcessingException e) { return "[]"; }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseJson(String json) {
        try { return json != null ? objectMapper.readValue(json, List.class) : List.of(); }
        catch (JsonProcessingException e) { return List.of(); }
    }
}
