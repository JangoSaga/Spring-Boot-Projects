package com.crudDemo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.crudDemo.DAO.AppDAO;
import com.crudDemo.entity.Instructor;
import com.crudDemo.entity.InstructorDetail;

@SpringBootApplication
public class CrudDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrudDemoApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(AppDAO appDAO) {
        return runner -> {
            createInstructor(appDAO);
        };
    }

    private void createInstructor(AppDAO appDAO) {
        Instructor tempInstructor = new Instructor("Karan", "V", "karan@karan.com");
        InstructorDetail tempInstructorDetail = new InstructorDetail("www.youtube.com", "dance");
        tempInstructor.setInstructorDetail(tempInstructorDetail);
        appDAO.save(tempInstructor);
    }
}
