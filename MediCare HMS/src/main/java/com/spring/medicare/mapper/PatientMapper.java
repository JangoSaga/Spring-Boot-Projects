package com.spring.medicare.mapper;

import org.springframework.stereotype.Component;

import com.spring.medicare.DTO.patient.*;
import com.spring.medicare.Entities.Patient;
import com.spring.medicare.Entities.User;

@Component
public class PatientMapper {

    public static Patient toEntity(PatientRequestDTO dto, User user) {
        if (dto == null || user == null) {
            return null;
        }
        return Patient.builder()
                .user(user)
                .dateOfBirth(dto.dateOfBirth())
                .gender(dto.gender())
                .bloodGroup(dto.bloodGroup())
                .address(dto.address())
                .emergencyContactName(dto.emergencyContactName())
                .emergencyContactPhone(dto.emergencyContactPhone())
                .allergies(dto.allergies())
                .build();
    }

    public static PatientResponseDTO toDto(Patient entity) {
        if (entity == null) {
            return null;
        }
        var user = entity.getUser();
        return new PatientResponseDTO(
                entity.getId(),
                user != null ? user.getFullName() : null,
                user != null ? user.getEmail() : null,
                user != null ? user.getPhone() : null,
                entity.getDateOfBirth(),
                entity.getGender(),
                entity.getBloodGroup()
        );
    }
}
