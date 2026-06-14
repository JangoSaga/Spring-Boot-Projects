package com.spring.medicare.DTO.medicalrecord;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MedicalRecordRequestDTO(

        @NotNull(message = "Patient id is required")
        Long patientId,

        @NotNull(message = "Doctor id is required")
        Long doctorId,

        @NotNull(message = "Appointment id is required")
        Long appointmentId,

        @NotBlank(message = "Symptoms are required")
        String symptoms,

        @NotBlank(message = "Diagnosis is required")
        String diagnosis,

        @NotBlank(message = "Prescription is required")
        String prescription,

        @NotBlank(message = "Treatment notes are required")
        String treatmentNotes,

        LocalDate followUpDate

) {}
