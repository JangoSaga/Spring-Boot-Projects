# Task CRUD API

This is a simple CLI task application.

## Database

- MySQL

## Features

- Create a new task
- Read existing tasks
- Update a task
- Delete a task

## Setup

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd taskCrudAPI
   ```
3. Configure the MySQL database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/yourDatabase
   spring.datasource.username=yourUsername
   spring.datasource.password=yourPassword
   ```
4. Run the application:
   ```sh
   ./mvnw spring-boot:run
   ```

## Usage

- To create a new task, use the following command:
  ```sh
  curl -X POST http://localhost:8080/tasks -d '{"name": "New Task", "description": "Task description"}' -H "Content-Type: application/json"
  ```
- To read all tasks, use the following command:
  ```sh
  curl http://localhost:8080/tasks
  ```
- To update a task, use the following command:
  ```sh
  curl -X PUT http://localhost:8080/tasks/{id} -d '{"name": "Updated Task", "description": "Updated description"}' -H "Content-Type: application/json"
  ```
- To delete a task, use the following command:
  ```sh
  curl -X DELETE http://localhost:8080/tasks/{id}
  ```
