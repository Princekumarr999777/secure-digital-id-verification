package com.example.secureid.service;

import com.example.secureid.dto.IssueCredentialRequest;
import com.example.secureid.dto.IssueCredentialResponse;
import com.example.secureid.dto.VerifyCredentialResponse;
import com.example.secureid.model.CredentialStatus;
import com.example.secureid.model.DigitalID;
import com.example.secureid.repository.DigitalIDRepository;
import io.jsonwebtoken.JwtException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class CredentialService {
    private final DigitalIDRepository repository;
    private final CryptographicService cryptography;
    private final long ttlMinutes;

    public CredentialService(DigitalIDRepository repository, CryptographicService cryptography,
                             @Value("${app.jwt.ttl-minutes}") long ttlMinutes) {
        this.repository = repository;
        this.cryptography = cryptography;
        this.ttlMinutes = ttlMinutes;
    }

    @Transactional
    public IssueCredentialResponse issue(IssueCredentialRequest request) {
        DigitalID credential = new DigitalID(UUID.randomUUID(), request.holderName().trim(),
                request.dateOfBirth(), request.role().trim());
        // PostgreSQL TIMESTAMPTZ stores microsecond precision; sign exactly what is persisted.
        credential.setCreatedAt(Instant.now().truncatedTo(ChronoUnit.MICROS));
        credential.setDigitalSignature(cryptography.signCredential(credential));
        repository.saveAndFlush(credential);
        String token = cryptography.issueToken(credential.getId(), credential.getCreatedAt());
        Instant expiresAt = credential.getCreatedAt().plusSeconds(ttlMinutes * 60);
        return new IssueCredentialResponse(credential.getId(), credential.getHolderName(), credential.getRole(),
                expiresAt, token, cryptography.generateQrDataUri(token));
    }

    @Transactional
    public VerifyCredentialResponse verify(String token) {
        try {
            UUID id = cryptography.verifyAndReadSubject(token);
            return repository.findById(id)
                    .filter(credential -> credential.getStatus() == CredentialStatus.ACTIVE)
                    .filter(cryptography::verifyCredentialSignature)
                    .map(credential -> new VerifyCredentialResponse(true, "VALID", credential.getId(),
                            credential.getHolderName(), credential.getRole(), credential.getCreatedAt(),
                            "Credential is authentic and active."))
                    .orElseGet(() -> VerifyCredentialResponse.invalid("Credential is revoked or its signature is invalid."));
        } catch (JwtException | IllegalArgumentException ex) {
            return VerifyCredentialResponse.invalid("Token is malformed, expired, or has an invalid signature.");
        }
    }
}
