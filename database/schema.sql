CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS digital_ids (
    id UUID PRIMARY KEY,
    holder_name VARCHAR(160) NOT NULL,
    date_of_birth DATE NOT NULL,
    role VARCHAR(80) NOT NULL,
    digital_signature VARCHAR(128) NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'REVOKED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_digital_ids_status ON digital_ids(status);
CREATE INDEX IF NOT EXISTS idx_digital_ids_created_at ON digital_ids(created_at DESC);

-- Encryption guidance: prefer managed database/storage encryption (KMS-backed).
-- For application-independent field encryption, change PII columns to BYTEA and
-- use pgp_sym_encrypt/decrypt with a key supplied from a secret manager, never
-- embedded in this DDL. HMAC/JWT secrets must remain outside the database.
