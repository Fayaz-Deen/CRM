package com.crm.entity;

import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.GenericGenerator;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "meetings")
public class Meeting {
    @Id @GenericGenerator(name = "uuid2", strategy = "uuid2") @GeneratedValue(generator = "uuid2") private String id;
    @Column(nullable = false) private String contactId;
    @Column(nullable = false) private String userId;
    @Column(nullable = false) private LocalDateTime meetingDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private MeetingMedium medium;
    @Column(columnDefinition = "TEXT") private String notes;
    private String outcome;
    private LocalDate followupDate;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;

    public enum MeetingMedium { PHONE_CALL, WHATSAPP, EMAIL, SMS, IN_PERSON, VIDEO_CALL, INSTAGRAM_DM, OTHER }

    public Meeting() {}
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getContactId() { return contactId; }
    public void setContactId(String contactId) { this.contactId = contactId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public LocalDateTime getMeetingDate() { return meetingDate; }
    public void setMeetingDate(LocalDateTime meetingDate) { this.meetingDate = meetingDate; }
    public MeetingMedium getMedium() { return medium; }
    public void setMedium(MeetingMedium medium) { this.medium = medium; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }
    public LocalDate getFollowupDate() { return followupDate; }
    public void setFollowupDate(LocalDate followupDate) { this.followupDate = followupDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
