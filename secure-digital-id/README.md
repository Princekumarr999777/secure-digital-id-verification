# Secure Digital ID & QR Verification System

Full-stack credential issuer and inspector built with Java 17, Spring Boot 3, PostgreSQL and React.

## Features

- Issues digital IDs and creates expiring, HMAC-signed JWT QR payloads.
- Signs canonical credential data with HMAC-SHA256 and checks it against the persisted record at verification time.
- Rejects expired, malformed, tampered and revoked credentials.
- Generates downloadable QR codes in the issuer dashboard and supports pasted-token/file input in the inspector.
- Includes PostgreSQL DDL with field-level encryption guidance and Docker Compose for local development.

## Run locally

1. Copy `.env.example` to `.env` and set random values for `POSTGRES_PASSWORD` and `APP_JWT_SECRET` (at least 32 bytes).
2. Run `docker compose up --build` from this directory.
3. Open `http://localhost:5173`.

The API is available at `http://localhost:8080`; PostgreSQL is initialized with `database/schema.sql`. No real identity credentials should be used in this demonstration without a formal security and privacy review.

## API

- `POST /api/v1/credentials/issue` — body: `{ "holderName": "Asha Rao", "dateOfBirth": "1998-04-12", "role": "Member" }`; returns ID details, JWT token and a Base64 PNG QR data URI.
- `POST /api/v1/credentials/verify` — body: `{ "token": "<JWT>" }`; returns validity and safe credential metadata.
- `GET /actuator/health` — health probe.

Tokens are signed with HS256 and expire after the configured lifetime. The QR contains the signed token, not the raw birth date or holder details. The stored digital signature binds the normalized credential attributes to its database row. Configure secrets through a secret manager in production, use TLS, and enable PostgreSQL disk encryption / `pgcrypto` column encryption as appropriate.
