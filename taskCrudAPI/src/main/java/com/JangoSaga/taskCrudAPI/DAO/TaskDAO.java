package com.JangoSaga.taskCrudAPI.DAO;

import com.JangoSaga.taskCrudAPI.Entity.Task;

public interface TaskDAO {

    void addTask(Task newTask);

    void deleteTask(Long id);

    void updateTask(Long id, Task updatedTask);

    void getAllTasks();

    Task getTaskById(Long id);
}
