package com.spring.medicare.DTO.auth;

import com.spring.medicare.Entities.Role;

public record AuthResponseDTO(
        Long id,
        String fullName,
        String email,
        Role role,
        String phone,
        String token
) {}
