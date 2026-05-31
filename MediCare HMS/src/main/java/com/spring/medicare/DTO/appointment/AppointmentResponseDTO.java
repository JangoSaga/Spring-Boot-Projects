package com.spring.medicare.DTO.appointment;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentResponseDTO(

        Long id,

        Long patientId,

        String patientName,

        Long doctorId,

        String doctorName,

        LocalDate appointmentDate,

        LocalTime appointmentTime,

        String status

) {}
