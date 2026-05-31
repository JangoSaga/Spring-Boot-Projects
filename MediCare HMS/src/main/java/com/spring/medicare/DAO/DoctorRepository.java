package com.spring.medicare.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.medicare.Entities.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialization(String specialization);
}
