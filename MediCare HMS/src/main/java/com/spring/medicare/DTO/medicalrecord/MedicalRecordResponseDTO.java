package com.spring.medicare.DTO.medicalrecord;

import java.time.LocalDate;

public record MedicalRecordResponseDTO(
        Long id,

        String diagnosis,

        String prescription,

        String treatmentNotes,

        LocalDate followUpDate
) {}
