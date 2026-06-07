package com.spring.medicare.DTO.patient;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PatientRequestDTO(
        @NotBlank(message = "Patient full name is required")
        String fullName,

        @NotBlank(message = "Patient email is required")
        @Email(message = "Patient email must be valid")
        String email,

        @NotBlank(message = "Patient phone is required")
        String phone,

        @NotNull(message = "Patient date of birth is required")
        LocalDate dateOfBirth,

        @NotBlank(message = "Patient gender is required")
        String gender,

        @NotBlank(message = "Patient blood group is required")
        String bloodGroup,

        @NotBlank(message = "Patient address is required")
        String address,

        @NotBlank(message = "Emergency contact name is required")
        String emergencyContactName,

        @NotBlank(message = "Emergency contact phone is required")
        String emergencyContactPhone,

        String allergies
) {}
