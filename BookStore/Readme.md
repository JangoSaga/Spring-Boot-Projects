# 📚 BookStore API

The **BookStore API** is a Spring Boot application that provides RESTful endpoints for managing books and authors in a bookstore.

## ⚙️ Features

- Retrieve all books.
- Retrieve a book by its ID.
- Retrieve a book by its title.
- Manage authors and their associated books.

## ⚙️ Technologies Used

- **Spring Boot**: Framework for building the application.
- **Spring Data JPA**: For database interactions.
- **MySQL**: Database for storing book and author data.
- **Maven**: Build and dependency management tool.

## Database Schema

The database consists of two tables:

1. **Authors**: Stores author details.

   - `a_id`: Primary key.
   - `a_name`: Name of the author.
   - `a_genre`: Genre of the author.

2. **Books**: Stores book details.
   - `b_id`: Primary key.
   - `a_id`: Foreign key referencing `Authors`.
   - `title`: Title of the book.
   - `genres`: Genre of the book.
   - `pages`: Number of pages.
   - `p_date`: Publish date.

## Endpoints

### Base URL: `/bookStore`

- **GET /books**  
  Retrieve all books.

- **GET /books/id/{bookId}**  
  Retrieve a book by its ID.

- **GET /books/title/{bookName}**  
  Retrieve a book by its title.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd BookStore
   ```

2. Configure the database in `src/main/resources/application.properties`:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bookStore
   spring.datasource.username=springstudent
   spring.datasource.password=springstudent
   ```

3. Run the SQL script `src/data/schema.sql` to set up the database schema.

4. Build and run the application:

   ```bash
   ./mvnw spring-boot:run
   ```

5. Access the API at `http://localhost:8080/bookStore`.

## License

This project is licensed under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Author

Developed by **Karan**.
