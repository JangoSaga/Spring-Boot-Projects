package com.spring.medicare.Entities;
import jakarta.persistence.*;
import lombok.*; 
import java.time.LocalDate;
@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;

    private String address;

    private String emergencyContactName;
    private String emergencyContactPhone;

    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String medicalHistorySummary;
}