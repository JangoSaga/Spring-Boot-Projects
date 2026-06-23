package com.spring.medicare.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.medicare.DAO.*;
import com.spring.medicare.DTO.auth.*;
import com.spring.medicare.Entities.*;
import com.spring.medicare.config.TokenProvider;
import com.spring.medicare.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Email already registered: " + dto.email());
        }

        Role roleEnum;
        try {
            roleEnum = Role.valueOf(dto.role().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role selected: " + dto.role());
        }

        User user = User.builder()
                .fullName(dto.fullName())
                .email(dto.email())
                .phone(dto.phone())
                .passwordHash(passwordEncoder.encode(dto.passwordHash()))
                .role(roleEnum)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // Depending on role, create and save corresponding profile
        Long responseId = savedUser.getId();
        if (roleEnum == Role.PATIENT) {
            Patient patient = Patient.builder()
                    .user(savedUser)
                    .medicalHistorySummary("No major history")
                    .build();
            Patient savedPatient = patientRepository.save(patient);
            responseId = savedPatient.getId();
        } else if (roleEnum == Role.DOCTOR) {
            // Find a default department to avoid FK violation
            Department defaultDept = departmentRepository.findAll().stream()
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("No departments available to assign doctor. Please initialize departments first."));

            Doctor doctor = Doctor.builder()
                    .user(savedUser)
                    .department(defaultDept)
                    .specialization("General Practitioner")
                    .qualification("MD")
                    .experienceYears(1)
                    .consultationFee(50.0)
                    .licenseNumber("DOC-" + System.currentTimeMillis())
                    .bio("Registered clinical practitioner.")
                    .isAvailable(true)
                    .build();
            Doctor savedDoctor = doctorRepository.save(doctor);
            responseId = savedDoctor.getId();
        }

        String token = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());

        return new AuthResponseDTO(
                responseId,
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getPhone(),
                token
        );
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.passwordHash(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        Long responseId = user.getId();
        if (user.getRole() == Role.PATIENT) {
            responseId = patientRepository.findByUserId(user.getId())
                    .map(Patient::getId)
                    .orElse(user.getId());
        } else if (user.getRole() == Role.DOCTOR) {
            responseId = doctorRepository.findByUserId(user.getId())
                    .map(Doctor::getId)
                    .orElse(user.getId());
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return new AuthResponseDTO(
                responseId,
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                token
        );
    }
}
