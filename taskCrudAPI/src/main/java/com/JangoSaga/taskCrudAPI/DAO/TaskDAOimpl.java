package com.JangoSaga.taskCrudAPI.DAO;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.JangoSaga.taskCrudAPI.Entity.Task;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
public class TaskDAOimpl implements TaskDAO {

    private final EntityManager manager;

    public TaskDAOimpl(EntityManager theManager) {
        this.manager = theManager;
    }

    @Override
    @Transactional
    public void addTask(Task newTask) {
        manager.persist(newTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task taskToBeDeleted = getTaskById(id);
        if (taskToBeDeleted == null) {
            System.out.println("Task not found");
        } else {
            manager.remove(taskToBeDeleted);
        }
    }

    @Override
    @Transactional
    public void updateTask(Long id, Task updatedTask) {
        Task existingTask = getTaskById(id);
        if (existingTask == null) {
            System.out.println("Task not found");

        } else {
            existingTask.setTask_name(updatedTask.getTask_name());
            existingTask.setStatus(updatedTask.getStatus());
            existingTask.setPriority(updatedTask.getPriority());
            manager.merge(existingTask);
        }
    }

    @Override
    public Task getTaskById(Long id) {
        Task taskofId = manager.find(Task.class, id);
        if (taskofId == null) {
            return null;
        }
        return taskofId;
    }

    @Override
    public void getAllTasks() {
        TypedQuery<Task> theQuery = manager.createQuery("FROM Task", Task.class);

        List<Task> tasks = theQuery.getResultList();

        if (tasks.isEmpty()) {
            System.out.println("No tasks found.");
            return;
        }
        for (Task task : tasks) {
            System.out.println(task.toString());
        }
    }

}
