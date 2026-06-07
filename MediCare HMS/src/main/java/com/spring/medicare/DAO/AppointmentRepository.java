package com.spring.medicare.DAO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.medicare.Entities.Appointment;
import com.spring.medicare.Entities.AppointmentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);

    List<Appointment> findByDoctorId(Long doctorId);

    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

    List<Appointment> findByAppointmentDate(LocalDate date);

    List<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long doctorId, LocalDate date, LocalTime time, AppointmentStatus status);
}
