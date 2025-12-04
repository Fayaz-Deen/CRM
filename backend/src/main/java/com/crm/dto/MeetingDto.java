package com.crm.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class MeetingDto {
    private String id;
    @NotBlank private String contactId;
    @NotNull private String meetingDate;
    @NotBlank private String medium;
    private String notes;
    private String outcome;
    private String followupDate;
    private String createdAt;
    private String updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getContactId() { return contactId; }
    public void setContactId(String contactId) { this.contactId = contactId; }
    public String getMeetingDate() { return meetingDate; }
    public void setMeetingDate(String meetingDate) { this.meetingDate = meetingDate; }
    public String getMedium() { return medium; }
    public void setMedium(String medium) { this.medium = medium; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }
    public String getFollowupDate() { return followupDate; }
    public void setFollowupDate(String followupDate) { this.followupDate = followupDate; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String c) { this.createdAt = c; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String u) { this.updatedAt = u; }
}
