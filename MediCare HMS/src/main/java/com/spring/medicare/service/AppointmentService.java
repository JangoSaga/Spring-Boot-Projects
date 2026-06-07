package com.spring.medicare.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.spring.medicare.DAO.AppointmentRepository;
import com.spring.medicare.DAO.DoctorRepository;
import com.spring.medicare.DAO.PatientRepository;
import com.spring.medicare.DTO.appointment.AppointmentRequestDTO;
import com.spring.medicare.DTO.appointment.AppointmentResponseDTO;
import com.spring.medicare.Entities.Appointment;
import com.spring.medicare.Entities.AppointmentStatus;
import com.spring.medicare.exception.AppointmentConflictException;
import com.spring.medicare.exception.InvalidRequestException;
import com.spring.medicare.exception.ResourceNotFoundException;
import com.spring.medicare.mapper.AppointmentMapper;

import lombok.RequiredArgsConstructor;

/**
 * Service that handles appointment booking, retrieval, and status transitions.
 */
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {
        validateAppointmentRequest(dto);
        var patient = patientRepository.findById(dto.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.patientId()));
        var doctor = doctorRepository.findById(dto.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.doctorId()));
        checkDoctorAvailability(doctor.getId(), dto.appointmentDate(), dto.appointmentTime());
        var appointment = AppointmentMapper.toEntity(dto, patient, doctor);
        return AppointmentMapper.toDto(appointmentRepository.save(appointment));
    }

    public AppointmentResponseDTO getAppointmentById(Long id) {
        return AppointmentMapper.toDto(findAppointment(id));
    }

    public Page<AppointmentResponseDTO> getAllAppointments(Pageable pageable) {
        return appointmentRepository.findAll(pageable).map(AppointmentMapper::toDto);
    }

    public Page<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorId, Pageable pageable) {
        doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));
        return appointmentRepository.findByDoctorId(doctorId, pageable).map(AppointmentMapper::toDto);
    }

    public Page<AppointmentResponseDTO> getAppointmentsByPatient(Long patientId, Pageable pageable) {
        patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));
        return appointmentRepository.findByPatientId(patientId, pageable).map(AppointmentMapper::toDto);
    }

    public AppointmentResponseDTO cancelAppointment(Long id) {
        var appointment = findAppointment(id);
        appointment.setStatus(AppointmentStatus.CANCELLED);
        return AppointmentMapper.toDto(appointmentRepository.save(appointment));
    }

    public AppointmentResponseDTO markAppointmentCompleted(Long id) {
        var appointment = findAppointment(id);
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new InvalidRequestException("Cannot complete a cancelled appointment");
        }
        appointment.setStatus(AppointmentStatus.COMPLETED);
        return AppointmentMapper.toDto(appointmentRepository.save(appointment));
    }

    private void validateAppointmentRequest(AppointmentRequestDTO dto) {
        if (dto.appointmentDate() == null || dto.appointmentTime() == null) {
            throw new InvalidRequestException("Appointment date and time are required");
        }
        if (dto.appointmentDate().isBefore(LocalDate.now())) {
            throw new InvalidRequestException("Cannot book appointments in the past");
        }
    }

    private void checkDoctorAvailability(Long doctorId, LocalDate date, LocalTime time) {
        List<Appointment> conflicts = appointmentRepository.findByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                doctorId, date, time, AppointmentStatus.CANCELLED);
        if (!conflicts.isEmpty()) {
            throw new AppointmentConflictException("Doctor already has an appointment at the requested date and time");
        }
    }

    private Appointment findAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }
}
