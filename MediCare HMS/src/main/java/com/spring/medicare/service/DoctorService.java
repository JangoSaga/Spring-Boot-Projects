package com.spring.medicare.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.spring.medicare.DAO.DepartmentRepository;
import com.spring.medicare.DAO.DoctorRepository;
import com.spring.medicare.DAO.UserRepository;
import com.spring.medicare.DTO.doctor.DoctorRequestDTO;
import com.spring.medicare.DTO.doctor.DoctorResponseDTO;
import com.spring.medicare.Entities.Doctor;
import com.spring.medicare.Entities.Role;
import com.spring.medicare.Entities.User;
import com.spring.medicare.exception.ResourceNotFoundException;
import com.spring.medicare.mapper.DoctorMapper;

import lombok.RequiredArgsConstructor;

/**
 * Service that manages doctor-specific business rules and DTO mapping.
 */
@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public DoctorResponseDTO createDoctor(DoctorRequestDTO dto) {
        var department = departmentRepository.findById(dto.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.departmentId()));
        var user = User.builder()
                .fullName(dto.fullName())
                .email(dto.email())
                .phone(dto.phone())
                .role(Role.DOCTOR)
                .isActive(true)
                .build();
        var savedUser = userRepository.save(user);
        var doctor = DoctorMapper.toEntity(dto, savedUser, department);
        return DoctorMapper.toDto(doctorRepository.save(doctor));
    }

    public DoctorResponseDTO getDoctorById(Long id) {
        return DoctorMapper.toDto(findDoctor(id));
    }

    public Page<DoctorResponseDTO> getAllDoctors(Pageable pageable) {
        return doctorRepository.findAll(pageable).map(DoctorMapper::toDto);
    }

    public Page<DoctorResponseDTO> getDoctorsByDepartment(Long departmentId, Pageable pageable) {
        departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
        return doctorRepository.findByDepartmentId(departmentId, pageable).map(DoctorMapper::toDto);
    }

    public DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO dto) {
        var doctor = findDoctor(id);
        var department = departmentRepository.findById(dto.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.departmentId()));
        var user = doctor.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("Doctor user profile is missing for doctor id: " + id);
        }
        user.setFullName(dto.fullName());
        user.setEmail(dto.email());
        user.setPhone(dto.phone());
        userRepository.save(user);
        doctor.setDepartment(department);
        doctor.setSpecialization(dto.specialization());
        doctor.setQualification(dto.qualification());
        doctor.setExperienceYears(dto.experienceYears());
        doctor.setConsultationFee(dto.consultationFee());
        doctor.setLicenseNumber(dto.licenseNumber());
        return DoctorMapper.toDto(doctorRepository.save(doctor));
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    private Doctor findDoctor(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }
}
