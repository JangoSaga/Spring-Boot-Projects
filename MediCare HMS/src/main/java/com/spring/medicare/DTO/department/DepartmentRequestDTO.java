package com.spring.medicare.DTO.department;

import jakarta.validation.constraints.NotBlank;

public record DepartmentRequestDTO(

        @NotBlank
        String name,

        String description

) {}
