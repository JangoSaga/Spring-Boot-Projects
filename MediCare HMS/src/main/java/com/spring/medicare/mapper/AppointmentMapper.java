package com.spring.medicare.mapper;

import org.springframework.stereotype.Component;

import com.spring.medicare.DTO.appointment.*;
import com.spring.medicare.Entities.Appointment;
import com.spring.medicare.Entities.AppointmentStatus;
import com.spring.medicare.Entities.Doctor;
import com.spring.medicare.Entities.Patient;

@Component  
public class AppointmentMapper {

    public static Appointment toEntity(AppointmentRequestDTO dto, Patient patient, Doctor doctor) {
        if (dto == null || patient == null || doctor == null) {
            return null;
        }
        return Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(dto.appointmentDate())
                .appointmentTime(dto.appointmentTime())
                .reason(dto.reason())
                .status(AppointmentStatus.BOOKED)
                .build();
    }

    public static AppointmentResponseDTO toDto(Appointment entity) {
        if (entity == null) {
            return null;
        }
        var patient = entity.getPatient();
        var doctor = entity.getDoctor();
        return new AppointmentResponseDTO(
                entity.getId(),
                patient != null ? patient.getId() : null,
                patient != null && patient.getUser() != null ? patient.getUser().getFullName() : null,
                doctor != null ? doctor.getId() : null,
                doctor != null && doctor.getUser() != null ? doctor.getUser().getFullName() : null,
                entity.getAppointmentDate(),
                entity.getAppointmentTime(),
                entity.getStatus() != null ? entity.getStatus().name() : null
        );
    }
}
