package com.JangoSaga.taskCrudAPI;

import java.util.Scanner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.JangoSaga.taskCrudAPI.DAO.TaskDAO;
import com.JangoSaga.taskCrudAPI.Entity.Task;

@SpringBootApplication
public class TaskCrudApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskCrudApiApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(TaskDAO taskDAO) {
        return runner -> {
            int choice = 0;
            Scanner ip = new Scanner(System.in);
            while (choice != 5) {
                printAll(taskDAO);
                System.out.println("Choose any task:");
                System.out.println("1. Create a new Task");
                System.out.println("2. Update existing Task");
                System.out.println("3. Delete existing Task");
                System.out.println("4. Get task by id");
                System.out.println("5. EXIT");
                choice = ip.nextInt();
                ip.nextLine();

                switch (choice) {
                    case 1:
                        createTask(taskDAO, ip);
                        break;
                    case 2:
                        updateTask(taskDAO, ip);
                        break;
                    case 3:
                        deleteTask(taskDAO, ip);
                        break;
                    case 4:
                        getTaskById(taskDAO, ip);
                        break;
                    case 5:
                        System.out.println("Exiting...");
                        break;
                    default:
                        System.out.println("Invalid choice. Please try again.");
                }
            }
            ip.close();
        };
    }

    private void printAll(TaskDAO taskDAO) {
        taskDAO.getAllTasks();
    }

    private void createTask(TaskDAO taskDAO, Scanner ip) {
        System.out.println("Enter task name:");
        String name = ip.nextLine();
        System.out.println("Enter task status:");
        String status = ip.nextLine();
        System.out.println("Enter task priority:");
        int priority = ip.nextInt();
        Task newTask = new Task(name, status, priority);
        taskDAO.addTask(newTask);
        System.out.println("Task created successfully.");
    }

    private void updateTask(TaskDAO taskDAO, Scanner ip) {
        Long id = ip.nextLong();
        ip.nextLine();
        if (taskDAO.getTaskById(id) == null) {
            System.out.println("Task Not found");
            return;
        }
        System.out.println("Enter new task name:");
        String name = ip.nextLine();
        System.out.println("Enter new task status:");
        String status = ip.nextLine();
        System.out.println("Enter new task priority:");
        int priority = ip.nextInt();
        Task updatedTask = new Task(name, status, priority);
        taskDAO.updateTask(id, updatedTask);
        System.out.println("Task updated successfully.");
    }

    private void deleteTask(TaskDAO taskDAO, Scanner ip) {
        System.out.println("Enter task id to delete:");
        Long id = ip.nextLong();
        if (taskDAO.getTaskById(id) == null) {
            System.out.println("Task Not found");
            return;
        }
        ip.nextLine();
        taskDAO.deleteTask(id);
        System.out.println("Task deleted successfully.");
    }

    private void getTaskById(TaskDAO taskDAO, Scanner ip) {
        System.out.println("Enter task id to retrieve:");
        Long id = ip.nextLong();
        ip.nextLine();
        Task task = taskDAO.getTaskById(id);
        if (task == null) {
            System.out.println("Task Not found");
            return;
        }
        System.out.println(task.toString());
    }
}
