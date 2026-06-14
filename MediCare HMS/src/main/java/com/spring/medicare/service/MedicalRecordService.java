package com.spring.medicare.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.spring.medicare.DAO.AppointmentRepository;
import com.spring.medicare.DAO.DoctorRepository;
import com.spring.medicare.DAO.MedicalRecordRepository;
import com.spring.medicare.DAO.PatientRepository;
import com.spring.medicare.DTO.medicalrecord.MedicalRecordRequestDTO;
import com.spring.medicare.DTO.medicalrecord.MedicalRecordResponseDTO;
import com.spring.medicare.Entities.Appointment;
import com.spring.medicare.Entities.Doctor;
import com.spring.medicare.Entities.MedicalRecord;
import com.spring.medicare.Entities.Patient;
import com.spring.medicare.exception.InvalidRequestException;
import com.spring.medicare.exception.ResourceNotFoundException;
import com.spring.medicare.mapper.MedicalRecordMapper;

import lombok.RequiredArgsConstructor;

/**
 * Service that manages medical records and ensures referential integrity.
 */
@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public MedicalRecordResponseDTO createMedicalRecord(MedicalRecordRequestDTO dto) {
        var patient = patientRepository.findById(dto.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.patientId()));
        var doctor = doctorRepository.findById(dto.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.doctorId()));
        var appointment = appointmentRepository.findById(dto.appointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + dto.appointmentId()));
        validateAppointmentOwnership(patient, doctor, appointment);
        var medicalRecord = MedicalRecordMapper.toEntity(dto, patient, doctor, appointment);
        return MedicalRecordMapper.toDto(medicalRecordRepository.save(medicalRecord));
    }

    public MedicalRecordResponseDTO getMedicalRecordById(Long id) {
        return MedicalRecordMapper.toDto(findMedicalRecord(id));
    }

    public List<MedicalRecordResponseDTO> getRecordsByPatient(Long patientId) {
        patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));
        return medicalRecordRepository.findByPatientId(patientId).stream()
                .map(MedicalRecordMapper::toDto)
                .toList();
    }

    public MedicalRecordResponseDTO updateMedicalRecord(Long id, MedicalRecordRequestDTO dto) {
        var medicalRecord = findMedicalRecord(id);
        var patient = patientRepository.findById(dto.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.patientId()));
        var doctor = doctorRepository.findById(dto.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.doctorId()));
        var appointment = appointmentRepository.findById(dto.appointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + dto.appointmentId()));
        validateAppointmentOwnership(patient, doctor, appointment);
        medicalRecord.setPatient(patient);
        medicalRecord.setDoctor(doctor);
        medicalRecord.setAppointment(appointment);
        medicalRecord.setSymptoms(dto.symptoms());
        medicalRecord.setDiagnosis(dto.diagnosis());
        medicalRecord.setPrescription(dto.prescription());
        medicalRecord.setTreatmentNotes(dto.treatmentNotes());
        medicalRecord.setFollowUpDate(dto.followUpDate());
        return MedicalRecordMapper.toDto(medicalRecordRepository.save(medicalRecord));
    }

    public void deleteMedicalRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medical record not found with id: " + id);
        }
        medicalRecordRepository.deleteById(id);
    }

    private MedicalRecord findMedicalRecord(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));
    }

    private void validateAppointmentOwnership(Patient patient, Doctor doctor, Appointment appointment) {
        if (appointment.getPatient() == null || appointment.getDoctor() == null
                || !appointment.getPatient().getId().equals(patient.getId())
                || !appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new InvalidRequestException("Appointment does not belong to the provided patient or doctor");
        }
    }
}
