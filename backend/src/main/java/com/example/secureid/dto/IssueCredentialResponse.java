package com.example.secureid.dto;

import java.time.Instant;
import java.util.UUID;

public record IssueCredentialResponse(UUID id, String holderName, String role, Instant expiresAt,
                                      String token, String qrCodeDataUri) {
}
