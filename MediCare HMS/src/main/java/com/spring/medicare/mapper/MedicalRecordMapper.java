package com.spring.medicare.mapper;

import org.springframework.stereotype.Component;

import com.spring.medicare.DTO.medicalrecord.*;
import com.spring.medicare.Entities.Appointment;
import com.spring.medicare.Entities.Doctor;
import com.spring.medicare.Entities.MedicalRecord;
import com.spring.medicare.Entities.Patient;

@Component
public class MedicalRecordMapper {

    public static MedicalRecord toEntity(MedicalRecordRequestDTO dto, Patient patient, Doctor doctor, Appointment appointment) {
        if (dto == null || patient == null || doctor == null || appointment == null) {
            return null;
        }
        return MedicalRecord.builder()
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .symptoms(dto.symptoms())
                .diagnosis(dto.diagnosis())
                .prescription(dto.prescription())
                .treatmentNotes(dto.treatmentNotes())
                .followUpDate(dto.followUpDate())
                .build();
    }

    public static MedicalRecordResponseDTO toDto(MedicalRecord entity) {
        if (entity == null) {
            return null;
        }
        return new MedicalRecordResponseDTO(
                entity.getId(),
                entity.getPatient() != null ? entity.getPatient().getId() : null,
                entity.getDoctor() != null ? entity.getDoctor().getId() : null,
                entity.getAppointment() != null ? entity.getAppointment().getId() : null,
                entity.getSymptoms(),
                entity.getDiagnosis(),
                entity.getPrescription(),
                entity.getTreatmentNotes(),
                entity.getFollowUpDate()
        );
    }
}
