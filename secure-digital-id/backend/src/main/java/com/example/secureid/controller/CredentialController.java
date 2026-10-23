package com.example.secureid.controller;

import com.example.secureid.dto.IssueCredentialRequest;
import com.example.secureid.dto.IssueCredentialResponse;
import com.example.secureid.dto.VerifyCredentialRequest;
import com.example.secureid.dto.VerifyCredentialResponse;
import com.example.secureid.service.CredentialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/credentials")
public class CredentialController {
    private final CredentialService credentials;

    public CredentialController(CredentialService credentials) {
        this.credentials = credentials;
    }

    @PostMapping("/issue")
    @ResponseStatus(HttpStatus.CREATED)
    public IssueCredentialResponse issue(@Valid @RequestBody IssueCredentialRequest request) {
        return credentials.issue(request);
    }

    @PostMapping("/verify")
    public VerifyCredentialResponse verify(@Valid @RequestBody VerifyCredentialRequest request) {
        return credentials.verify(request.token());
    }
}
