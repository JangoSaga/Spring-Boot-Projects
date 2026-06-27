package com.spring.medicare.mapper;

import org.springframework.stereotype.Component;

import com.spring.medicare.DTO.doctor.*;
import com.spring.medicare.Entities.Department;
import com.spring.medicare.Entities.Doctor;
import com.spring.medicare.Entities.User;

@Component
public class DoctorMapper {

    public static Doctor toEntity(DoctorRequestDTO dto, User user, Department department) {
        if (dto == null || user == null || department == null) {
            return null;
        }
        return Doctor.builder()
                .user(user)
                .department(department)
                .specialization(dto.specialization())
                .qualification(dto.qualification())
                .experienceYears(dto.experienceYears())
                .consultationFee(dto.consultationFee())
                .licenseNumber(dto.licenseNumber())
                .build();
    }

    public static DoctorResponseDTO toDto(Doctor entity) {
        if (entity == null) {
            return null;
        }
        var user = entity.getUser();
        return new DoctorResponseDTO(
                entity.getId(),
                user != null ? user.getFullName() : null,
                user != null ? user.getEmail() : null,
                user != null ? user.getPhone() : null,
                entity.getSpecialization(),
                entity.getQualification(),
                entity.getDepartment() != null ? entity.getDepartment().getName() : null,
                entity.getDepartment() != null ? entity.getDepartment().getId() : null,
                entity.getExperienceYears(),
                entity.getConsultationFee()
        );
    }
}
