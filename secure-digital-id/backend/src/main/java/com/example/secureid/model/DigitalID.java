package com.example.secureid.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "digital_ids")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DigitalID {
    @Id
    private UUID id;

    @Column(name = "holder_name", nullable = false, length = 160)
    private String holderName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 80)
    private String role;

    @Column(name = "digital_signature", nullable = false, length = 128)
    private String digitalSignature;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private CredentialStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public DigitalID(UUID id, String holderName, LocalDate dateOfBirth, String role) {
        this.id = id;
        this.holderName = holderName;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
        this.status = CredentialStatus.ACTIVE;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = CredentialStatus.ACTIVE;
    }
}
