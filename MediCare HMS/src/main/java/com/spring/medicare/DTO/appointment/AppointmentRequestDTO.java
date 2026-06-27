package com.spring.medicare.DTO.appointment;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AppointmentRequestDTO(

        @NotNull(message = "Patient id is required")
        Long patientId,

        @NotNull(message = "Doctor id is required")
        Long doctorId,

        @NotNull(message = "Appointment date is required")
        @FutureOrPresent(message = "Appointment date cannot be in the past")
        LocalDate appointmentDate,

        @NotNull(message = "Appointment time is required")
        LocalTime appointmentTime,

        @NotBlank(message = "Symptoms description is required")
        String symptoms

) {}
