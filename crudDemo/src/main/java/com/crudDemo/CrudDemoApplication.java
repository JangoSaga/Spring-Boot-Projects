package com.crudDemo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.crudDemo.DAO.AppDAO;
import com.crudDemo.entity.Course;
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
            // createInstructor(appDAO);
            // createInstructor(appDAO);
            // findInstructor(appDAO);
            // deleteInstructor(appDAO);
            // findInstructorDetailById(appDAO);
            // deleteInstructorDetailById(appDAO);
            createInstructorWithCourses(appDAO);
        };
    }

    private void createInstructorWithCourses(AppDAO appDAO) {
        Instructor tempInstructor = new Instructor("SUSAN", "V", "karan@karan2.com");
        InstructorDetail tempInstructorDetail = new InstructorDetail("www.yahoo.com", "relax");
        tempInstructor.setInstructorDetail(tempInstructorDetail);
        Course tempCourse = new Course("course1");
        tempInstructor.add(tempCourse);
        appDAO.save(tempInstructor);
        System.out.println("Saving the instructor" + tempInstructor);
        System.out.println("The courses" + tempInstructor.getCourses());
    }

    private void deleteInstructorDetailById(AppDAO appDAO) {
        int id = 6;
        System.out.println("Finding the instructorDetail with the id: " + id);
        appDAO.deleteInstructorDetailById(id);
        System.out.println("InstructorDetail deleted sucessfully !");
    }

    private void findInstructorDetailById(AppDAO appDAO) {
        int theId = 1;
        System.out.println("Finding the instructor detail the id: " + theId);
        InstructorDetail instructorDetail = appDAO.findInstructorDetailById(theId);
        System.out.println(instructorDetail.toString());
    }

    private void deleteInstructor(AppDAO appDAO) {
        int deleteId = 2;
        System.out.println("Finding the instructor with the id: " + deleteId);
        appDAO.deleteInstructorById(deleteId);
        System.out.println("Instructor deleted sucessfully !");

    }

    private void findInstructor(AppDAO appDAO) {
        int theId = 1;
        System.out.println("Find the instructor with id:" + theId);
        Instructor theInstructor = appDAO.findInstructorById(theId);
        if (theInstructor == null) {
            System.out.println("Instructor not found");
        } else {
            System.out.println("Instructor founded, here is the instructor detail" + theInstructor.getInstructorDetail());
        }
    }

    private void createInstructor(AppDAO appDAO) {
        Instructor tempInstructor = new Instructor("Varan", "V", "karan@karan2.com");
        InstructorDetail tempInstructorDetail = new InstructorDetail("www.yahoo.com", "relax");
        tempInstructor.setInstructorDetail(tempInstructorDetail);
        appDAO.save(tempInstructor);
    }
}
