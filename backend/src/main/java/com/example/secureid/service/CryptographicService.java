package com.example.secureid.service;

import com.example.secureid.model.DigitalID;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Service
public class CryptographicService {
    private final byte[] secret;
    private final long ttlMinutes;

    public CryptographicService(@Value("${app.jwt.secret}") String secret,
                                @Value("${app.jwt.ttl-minutes}") long ttlMinutes) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("APP_JWT_SECRET must contain at least 32 bytes");
        }
        if (ttlMinutes < 1 || ttlMinutes > 1440) {
            throw new IllegalStateException("APP_TOKEN_TTL_MINUTES must be between 1 and 1440");
        }
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.ttlMinutes = ttlMinutes;
    }

    public String signCredential(DigitalID id) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(Keys.hmacShaKeyFor(secret));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(
                    mac.doFinal(canonicalPayload(id).getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign credential", ex);
        }
    }

    public boolean verifyCredentialSignature(DigitalID id) {
        byte[] expected = signCredential(id).getBytes(StandardCharsets.US_ASCII);
        byte[] actual = id.getDigitalSignature().getBytes(StandardCharsets.US_ASCII);
        return MessageDigest.isEqual(expected, actual);
    }

    public String issueToken(UUID id, Instant issuedAt) {
        Instant expiresAt = issuedAt.plusSeconds(ttlMinutes * 60);
        return Jwts.builder()
                .issuer("secure-digital-id")
                .subject(id.toString())
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(expiresAt))
                .signWith(Keys.hmacShaKeyFor(secret))
                .compact();
    }

    public UUID verifyAndReadSubject(String token) {
        return UUID.fromString(Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret))
                .requireIssuer("secure-digital-id")
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject());
    }

    public String generateQrDataUri(String token) {
        try {
            BitMatrix matrix = new QRCodeWriter().encode(token, BarcodeFormat.QR_CODE, 360, 360);
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", output);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(output.toByteArray());
        } catch (Exception ex) {
            throw new IllegalStateException("Could not generate QR code", ex);
        }
    }

    private String canonicalPayload(DigitalID id) {
        return String.join("", field("digital-id-v1"), field(id.getId().toString()), field(id.getHolderName()),
                field(id.getDateOfBirth().toString()), field(id.getRole()), field(id.getStatus().name()),
                field(id.getCreatedAt().toString()));
    }

    private String field(String value) {
        return value.length() + ":" + value;
    }
}
