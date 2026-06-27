package com.spring.medicare.DTO.doctor;

public record DoctorResponseDTO(
        Long id,

        String fullName,

        String email,

        String phone,

        String specialization,

        String qualification,

        String departmentName,

        Long departmentId,

        Integer experience,

        Double consultationFee
) {}
