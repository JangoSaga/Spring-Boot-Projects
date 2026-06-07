package com.spring.medicare.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.spring.medicare.DAO.PatientRepository;
import com.spring.medicare.DAO.UserRepository;
import com.spring.medicare.DTO.patient.PatientRequestDTO;
import com.spring.medicare.DTO.patient.PatientResponseDTO;
import com.spring.medicare.Entities.Patient;
import com.spring.medicare.Entities.Role;
import com.spring.medicare.Entities.User;
import com.spring.medicare.exception.ResourceNotFoundException;
import com.spring.medicare.mapper.PatientMapper;

import lombok.RequiredArgsConstructor;

/**
 * Service that encapsulates patient creation, retrieval, update, and deletion logic.
 */
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientResponseDTO createPatient(PatientRequestDTO dto) {
        var user = User.builder()
                .fullName(dto.fullName())
                .email(dto.email())
                .phone(dto.phone())
                .role(Role.PATIENT)
                .isActive(true)
                .build();
        var savedUser = userRepository.save(user);
        var patient = PatientMapper.toEntity(dto, savedUser);
        return PatientMapper.toDto(patientRepository.save(patient));
    }

    public PatientResponseDTO getPatientById(Long id) {
        var patient = findPatient(id);
        return PatientMapper.toDto(patient);
    }

    public Page<PatientResponseDTO> getAllPatients(Pageable pageable) {
        return patientRepository.findAll(pageable).map(PatientMapper::toDto);
    }

    public PatientResponseDTO updatePatient(Long id, PatientRequestDTO dto) {
        var patient = findPatient(id);
        var user = patient.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("Patient user profile is missing for patient id: " + id);
        }
        user.setFullName(dto.fullName());
        user.setEmail(dto.email());
        user.setPhone(dto.phone());
        userRepository.save(user);
        patient.setDateOfBirth(dto.dateOfBirth());
        patient.setGender(dto.gender());
        patient.setBloodGroup(dto.bloodGroup());
        patient.setAddress(dto.address());
        patient.setEmergencyContactName(dto.emergencyContactName());
        patient.setEmergencyContactPhone(dto.emergencyContactPhone());
        patient.setAllergies(dto.allergies());
        return PatientMapper.toDto(patientRepository.save(patient));
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    private Patient findPatient(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }
}
