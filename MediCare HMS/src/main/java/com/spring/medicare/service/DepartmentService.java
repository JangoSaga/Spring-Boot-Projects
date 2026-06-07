package com.spring.medicare.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.spring.medicare.DAO.DepartmentRepository;
import com.spring.medicare.DTO.department.DepartmentRequestDTO;
import com.spring.medicare.DTO.department.DepartmentResponseDTO;
import com.spring.medicare.exception.ResourceNotFoundException;
import com.spring.medicare.mapper.DepartmentMapper;

import lombok.RequiredArgsConstructor;

/**
 * Service responsible for department business logic and DTO mapping.
 */
@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO dto) {
        var department = DepartmentMapper.toEntity(dto);
        return DepartmentMapper.toDto(departmentRepository.save(department));
    }

    public DepartmentResponseDTO getDepartmentById(Long id) {
        var department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return DepartmentMapper.toDto(department);
    }

    public Page<DepartmentResponseDTO> getAllDepartments(Pageable pageable) {
        return departmentRepository.findAll(pageable).map(DepartmentMapper::toDto);
    }

    public DepartmentResponseDTO updateDepartment(Long id, DepartmentRequestDTO dto) {
        var department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        department.setName(dto.name());
        department.setDescription(dto.description());
        return DepartmentMapper.toDto(departmentRepository.save(department));
    }

    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }
}
