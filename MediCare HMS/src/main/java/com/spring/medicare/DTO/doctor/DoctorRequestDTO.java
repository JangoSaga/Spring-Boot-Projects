package com.spring.medicare.DTO.doctor;

public record DoctorRequestDTO(

        String fullName,

        String email,

        String phone,

        Long departmentId,

        String specialization,

        String qualification,

        Integer experienceYears,

        Double consultationFee,

        String licenseNumber

) {}
