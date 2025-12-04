package com.crm.dto;

import com.crm.entity.Share;
import java.time.LocalDateTime;

public class ShareDto {
    private String contactId;
    private String sharedWithEmail;
    private String permission;
    private LocalDateTime expiresAt;
    private String note;

    public String getContactId() { return contactId; }
    public void setContactId(String contactId) { this.contactId = contactId; }
    public String getSharedWithEmail() { return sharedWithEmail; }
    public void setSharedWithEmail(String sharedWithEmail) { this.sharedWithEmail = sharedWithEmail; }
    public String getPermission() { return permission; }
    public void setPermission(String permission) { this.permission = permission; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public static class ShareResponse {
        private String id;
        private String contactId;
        private String contactName;
        private String ownerUserId;
        private String ownerName;
        private String ownerEmail;
        private String sharedWithUserId;
        private String sharedWithName;
        private String sharedWithEmail;
        private String permission;
        private LocalDateTime expiresAt;
        private String note;
        private LocalDateTime createdAt;

        public static ShareResponse from(Share share, String contactName, String ownerName, String ownerEmail,
                                          String sharedWithName, String sharedWithEmail) {
            ShareResponse response = new ShareResponse();
            response.id = share.getId();
            response.contactId = share.getContactId();
            response.contactName = contactName;
            response.ownerUserId = share.getOwnerUserId();
            response.ownerName = ownerName;
            response.ownerEmail = ownerEmail;
            response.sharedWithUserId = share.getSharedWithUserId();
            response.sharedWithName = sharedWithName;
            response.sharedWithEmail = sharedWithEmail;
            response.permission = share.getPermission().name();
            response.expiresAt = share.getExpiresAt();
            response.note = share.getNote();
            response.createdAt = share.getCreatedAt();
            return response;
        }

        public String getId() { return id; }
        public String getContactId() { return contactId; }
        public String getContactName() { return contactName; }
        public String getOwnerUserId() { return ownerUserId; }
        public String getOwnerName() { return ownerName; }
        public String getOwnerEmail() { return ownerEmail; }
        public String getSharedWithUserId() { return sharedWithUserId; }
        public String getSharedWithName() { return sharedWithName; }
        public String getSharedWithEmail() { return sharedWithEmail; }
        public String getPermission() { return permission; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public String getNote() { return note; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }
}
