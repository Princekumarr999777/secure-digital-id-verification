package com.example.secureid.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record IssueCredentialRequest(
        @NotBlank @Size(max = 160) String holderName,
        @NotNull @Past LocalDate dateOfBirth,
        @NotBlank @Size(max = 80) String role) {
}
