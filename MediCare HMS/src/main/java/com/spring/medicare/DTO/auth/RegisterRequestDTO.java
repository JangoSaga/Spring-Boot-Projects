package com.spring.medicare.DTO.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
        @NotBlank(message = "Full name is required")
        @Size(min = 3, message = "Full name must be at least 3 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Please enter a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String passwordHash,

        @NotBlank(message = "Role is required")
        String role,

        @NotBlank(message = "Phone is required")
        String phone
) {}
