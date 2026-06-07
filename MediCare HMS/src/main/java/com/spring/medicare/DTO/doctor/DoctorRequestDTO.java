package com.spring.medicare.DTO.doctor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DoctorRequestDTO(

        @NotBlank(message = "Doctor full name is required")
        String fullName,

        @NotBlank(message = "Doctor email is required")
        @Email(message = "Doctor email must be valid")
        String email,

        @NotBlank(message = "Doctor phone number is required")
        String phone,

        @NotNull(message = "Department id is required")
        Long departmentId,

        @NotBlank(message = "Specialization is required")
        String specialization,

        @NotBlank(message = "Qualification is required")
        String qualification,

        @NotNull(message = "Experience years is required")
        @Min(value = 0, message = "Experience years cannot be negative")
        Integer experienceYears,

        @NotNull(message = "Consultation fee is required")
        Double consultationFee,

        @NotBlank(message = "License number is required")
        String licenseNumber

) {}
