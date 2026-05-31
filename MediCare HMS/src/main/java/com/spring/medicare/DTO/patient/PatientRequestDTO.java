package com.spring.medicare.DTO.patient;

import java.time.LocalDate;

public record PatientRequestDTO(
        String fullName,
        String email,
        String phone,

        LocalDate dateOfBirth,

        String gender,

        String bloodGroup,

        String address,

        String emergencyContactName,

        String emergencyContactPhone,

        String allergies
) {}
