package com.JangoSaga.taskCrudAPI.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private Long id;

    @Override
    public String toString() {
        return "Task [id=" + id + ", task_name=" + task_name + ", status=" + status + ", priority=" + priority + "]";
    }

    @Column(name = "task_name")
    private String task_name;

    @Column(name = "task_status")
    private String status;
    @Column(name = "task_priority")
    private int priority;

    public Task() {

    }

    public Task(String task_name, String status, int priority) {
        this.task_name = task_name;
        this.status = status;
        this.priority = priority;
    }

    public String getTask_name() {
        return task_name;
    }

    public void setTask_name(String task_name) {
        this.task_name = task_name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public Long getId() {
        return id;
    }

}
