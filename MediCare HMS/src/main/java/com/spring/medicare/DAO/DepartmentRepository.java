package com.spring.medicare.DAO;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.medicare.Entities.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
}
