package com.spring.medicare.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.medicare.Entities.MedicalRecord;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientId(Long patientId);
}
