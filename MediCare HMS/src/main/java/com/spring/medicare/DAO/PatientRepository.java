package com.spring.medicare.DAO;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.medicare.Entities.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    java.util.Optional<Patient> findByUserId(Long userId);
}
