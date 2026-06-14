package com.spring.medicare.DAO;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.medicare.Entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
}
