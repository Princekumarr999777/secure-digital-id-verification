package com.example.secureid.dto;

import java.time.Instant;
import java.util.UUID;

public record VerifyCredentialResponse(boolean valid, String status, UUID id, String holderName,
                                       String role, Instant createdAt, String message) {
    public static VerifyCredentialResponse invalid(String message) {
        return new VerifyCredentialResponse(false, "INVALID", null, null, null, null, message);
    }
}
