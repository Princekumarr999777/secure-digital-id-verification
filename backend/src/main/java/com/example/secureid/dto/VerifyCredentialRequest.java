package com.example.secureid.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyCredentialRequest(@NotBlank String token) {
}
