package com.spring.medicare.DTO.doctor;

public record DoctorResponseDTO(
        Long id,

        String fullName,

        String email,

        String specialization,

        String qualification,

        String departmentName,

        Double consultationFee
) {}
