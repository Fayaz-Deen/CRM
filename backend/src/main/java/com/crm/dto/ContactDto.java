package com.crm.dto;

import javax.validation.constraints.NotBlank;
import java.util.List;

public class ContactDto {
    private String id;
    @NotBlank private String name;
    private List<String> emails;
    private List<String> phones;
    private String whatsappNumber;
    private String instagramHandle;
    private String company;
    private List<String> tags;
    private String address;
    private String notes;
    private String birthday;
    private String anniversary;
    private String profilePicture;
    private String lastContactedAt;
    private String createdAt;
    private String updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getEmails() { return emails; }
    public void setEmails(List<String> emails) { this.emails = emails; }
    public List<String> getPhones() { return phones; }
    public void setPhones(List<String> phones) { this.phones = phones; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String w) { this.whatsappNumber = w; }
    public String getInstagramHandle() { return instagramHandle; }
    public void setInstagramHandle(String i) { this.instagramHandle = i; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getBirthday() { return birthday; }
    public void setBirthday(String birthday) { this.birthday = birthday; }
    public String getAnniversary() { return anniversary; }
    public void setAnniversary(String anniversary) { this.anniversary = anniversary; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String p) { this.profilePicture = p; }
    public String getLastContactedAt() { return lastContactedAt; }
    public void setLastContactedAt(String l) { this.lastContactedAt = l; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String c) { this.createdAt = c; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String u) { this.updatedAt = u; }
}
