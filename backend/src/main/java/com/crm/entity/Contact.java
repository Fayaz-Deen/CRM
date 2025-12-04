package com.crm.entity;

import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.GenericGenerator;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
public class Contact {
    @Id @GenericGenerator(name = "uuid2", strategy = "uuid2") @GeneratedValue(generator = "uuid2")
    private String id;
    @Column(nullable = false) private String userId;
    @Column(nullable = false) private String name;
    @Column(columnDefinition = "TEXT") private String emails;
    @Column(columnDefinition = "TEXT") private String phones;
    private String whatsappNumber;
    private String instagramHandle;
    private String company;
    @Column(columnDefinition = "TEXT") private String tags;
    private String address;
    @Column(columnDefinition = "TEXT") private String notes;
    private LocalDate birthday;
    private LocalDate anniversary;
    private String profilePicture;
    private LocalDateTime lastContactedAt;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;

    public Contact() {}
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmails() { return emails; }
    public void setEmails(String emails) { this.emails = emails; }
    public String getPhones() { return phones; }
    public void setPhones(String phones) { this.phones = phones; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }
    public String getInstagramHandle() { return instagramHandle; }
    public void setInstagramHandle(String instagramHandle) { this.instagramHandle = instagramHandle; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDate getBirthday() { return birthday; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }
    public LocalDate getAnniversary() { return anniversary; }
    public void setAnniversary(LocalDate anniversary) { this.anniversary = anniversary; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public LocalDateTime getLastContactedAt() { return lastContactedAt; }
    public void setLastContactedAt(LocalDateTime lastContactedAt) { this.lastContactedAt = lastContactedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
