package com.spring.medicare.DTO.appointment;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentRequestDTO(

        Long patientId,

        Long doctorId,

        LocalDate appointmentDate,

        LocalTime appointmentTime,

        String reason

) {}
