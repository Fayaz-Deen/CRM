package com.crm.service;

import com.crm.dto.ShareDto;
import com.crm.entity.Contact;
import com.crm.entity.Share;
import com.crm.entity.User;
import com.crm.repository.ContactRepository;
import com.crm.repository.ShareRepository;
import com.crm.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShareService {
    private final ShareRepository shareRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ShareService(ShareRepository shareRepository, ContactRepository contactRepository,
                        UserRepository userRepository) {
        this.shareRepository = shareRepository;
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ShareDto.ShareResponse shareContact(String ownerId, ShareDto dto) {
        Contact contact = contactRepository.findById(dto.getContactId())
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUserId().equals(ownerId)) {
            throw new RuntimeException("You can only share your own contacts");
        }

        User sharedWithUser = userRepository.findByEmail(dto.getSharedWithEmail())
                .orElseThrow(() -> new RuntimeException("User with email " + dto.getSharedWithEmail() + " not found"));

        if (sharedWithUser.getId().equals(ownerId)) {
            throw new RuntimeException("Cannot share contact with yourself");
        }

        if (shareRepository.existsByContactIdAndSharedWithUserId(dto.getContactId(), sharedWithUser.getId())) {
            throw new RuntimeException("Contact is already shared with this user");
        }

        Share share = new Share();
        share.setContactId(dto.getContactId());
        share.setOwnerUserId(ownerId);
        share.setSharedWithUserId(sharedWithUser.getId());
        share.setPermission(dto.getPermission() != null ?
                Share.SharePermission.valueOf(dto.getPermission()) : Share.SharePermission.VIEW);
        share.setExpiresAt(dto.getExpiresAt());
        share.setNote(dto.getNote());

        share = shareRepository.save(share);

        User owner = userRepository.findById(ownerId).orElseThrow();
        return ShareDto.ShareResponse.from(share, contact.getName(), owner.getName(), owner.getEmail(),
                sharedWithUser.getName(), sharedWithUser.getEmail());
    }

    public List<ShareDto.ShareResponse> getSharedByMe(String userId) {
        return shareRepository.findByOwnerUserId(userId).stream()
                .map(this::toShareResponse)
                .collect(Collectors.toList());
    }

    public List<ShareDto.ShareResponse> getSharedWithMe(String userId) {
        return shareRepository.findActiveSharesForUser(userId, LocalDateTime.now()).stream()
                .map(this::toShareResponse)
                .collect(Collectors.toList());
    }

    public Contact getSharedContact(String userId, String contactId) {
        Share share = shareRepository.findByContactIdAndSharedWithUserId(contactId, userId)
                .orElseThrow(() -> new RuntimeException("Contact not shared with you"));

        if (share.getExpiresAt() != null && share.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Share has expired");
        }

        return contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public Share.SharePermission getSharePermission(String userId, String contactId) {
        Share share = shareRepository.findByContactIdAndSharedWithUserId(contactId, userId)
                .orElseThrow(() -> new RuntimeException("Contact not shared with you"));
        return share.getPermission();
    }

    @Transactional
    public void revokeShare(String ownerId, String shareId) {
        Share share = shareRepository.findById(shareId)
                .orElseThrow(() -> new RuntimeException("Share not found"));

        if (!share.getOwnerUserId().equals(ownerId)) {
            throw new RuntimeException("Only the owner can revoke a share");
        }

        shareRepository.delete(share);
    }

    @Transactional
    public ShareDto.ShareResponse updateShare(String ownerId, String shareId, ShareDto dto) {
        Share share = shareRepository.findById(shareId)
                .orElseThrow(() -> new RuntimeException("Share not found"));

        if (!share.getOwnerUserId().equals(ownerId)) {
            throw new RuntimeException("Only the owner can update a share");
        }

        if (dto.getPermission() != null) {
            share.setPermission(Share.SharePermission.valueOf(dto.getPermission()));
        }
        if (dto.getExpiresAt() != null) {
            share.setExpiresAt(dto.getExpiresAt());
        }
        if (dto.getNote() != null) {
            share.setNote(dto.getNote());
        }

        share = shareRepository.save(share);
        return toShareResponse(share);
    }

    private ShareDto.ShareResponse toShareResponse(Share share) {
        Contact contact = contactRepository.findById(share.getContactId()).orElse(null);
        User owner = userRepository.findById(share.getOwnerUserId()).orElse(null);
        User sharedWith = userRepository.findById(share.getSharedWithUserId()).orElse(null);

        return ShareDto.ShareResponse.from(share,
                contact != null ? contact.getName() : "Unknown",
                owner != null ? owner.getName() : "Unknown",
                owner != null ? owner.getEmail() : "Unknown",
                sharedWith != null ? sharedWith.getName() : "Unknown",
                sharedWith != null ? sharedWith.getEmail() : "Unknown");
    }
}
