package com.spring.medicare.mapper;

import org.springframework.stereotype.Component;

import com.spring.medicare.DTO.auth.*;
import com.spring.medicare.Entities.Role;
import com.spring.medicare.Entities.User;

@Component
public class AuthMapper {

    public static User toUserEntity(RegisterRequestDTO dto, String passwordHash) {
        if (dto == null || passwordHash == null) {
            return null;
        }
        return User.builder()
                .fullName(dto.fullName())
                .email(dto.email())
                .phone(dto.phone())
                .passwordHash(passwordHash)
                .role(Role.valueOf(dto.role()))
                .build();
    }
}
