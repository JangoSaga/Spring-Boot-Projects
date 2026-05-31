package com.spring.medicare.DTO.medicalrecord;

import java.time.LocalDate;

public record MedicalRecordRequestDTO(

        Long patientId,

        Long doctorId,

        Long appointmentId,

        String symptoms,

        String diagnosis,

        String prescription,

        String treatmentNotes,

        LocalDate followUpDate

) {}
