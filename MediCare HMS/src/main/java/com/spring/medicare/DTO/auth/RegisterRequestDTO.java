package com.spring.medicare.DTO.auth;

public record RegisterRequestDTO(
        String fullName,
        String email,
        String password,
        String role
) {}
