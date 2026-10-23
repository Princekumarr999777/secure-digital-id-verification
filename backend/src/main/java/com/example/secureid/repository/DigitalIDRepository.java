package com.example.secureid.repository;

import com.example.secureid.model.DigitalID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DigitalIDRepository extends JpaRepository<DigitalID, UUID> {
}
