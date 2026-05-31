package com.spring.medicare.Entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    private String specialization;

    private String qualification;

    private Integer experienceYears;

    private Double consultationFee;

    @Column(unique = true)
    private String licenseNumber;

    private String bio;
    
    @Builder.Default
    private Boolean isAvailable = true;
}