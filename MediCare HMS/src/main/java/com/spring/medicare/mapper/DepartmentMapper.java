package com.spring.medicare.mapper;

import org.springframework.stereotype.Component;

import com.spring.medicare.DTO.department.*;
import com.spring.medicare.Entities.Department;

@Component
public class DepartmentMapper {

    public static Department toEntity(DepartmentRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Department.builder()
                .name(dto.name())
                .description(dto.description())
                .build();
    }

    public static DepartmentResponseDTO toDto(Department entity) {
        if (entity == null) {
            return null;
        }
        return new DepartmentResponseDTO(
                entity.getId(),
                entity.getName(),
                entity.getDescription()
        );
    }
}
