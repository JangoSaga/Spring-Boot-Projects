package com.spring.medicare.DTO.patient;

import java.time.LocalDate;

public record PatientResponseDTO(
        Long id,

        String fullName,

        String email,

        String phone,

        LocalDate dateOfBirth,

        String gender,

        String bloodGroup
) {}
