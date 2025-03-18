CREATE DATABASE BookStore;
USE BookStore;

CREATE TABLE Authors (
    a_id INT PRIMARY KEY AUTO_INCREMENT,
    a_name VARCHAR(100),
    a_genre VARCHAR(100)
);

CREATE TABLE Books (
    b_id INT PRIMARY KEY AUTO_INCREMENT,
    a_id INT,
    title VARCHAR(100),
    genres VARCHAR(100),
    pages INT,
    p_date DATE,
    FOREIGN KEY (a_id) REFERENCES Authors(a_id)
);
INSERT INTO Authors (a_name, a_genre) VALUES
('J.K. Rowling', 'Fantasy'),
('George R.R. Martin', 'Fantasy'),
('Agatha Christie', 'Mystery'),
('Dan Brown', 'Thriller'),
('Stephen King', 'Horror');

INSERT INTO Books (a_id, title, genres, pages, p_date) VALUES
(1, 'Harry Potter and the Sorcerer''s Stone', 'Fantasy', 309, '1997-06-26'),
(1, 'Harry Potter and the Chamber of Secrets', 'Fantasy', 341, '1998-07-02'),
(2, 'A Game of Thrones', 'Fantasy', 694, '1996-08-06'),
(2, 'A Clash of Kings', 'Fantasy', 768, '1998-11-16'),
(3, 'Murder on the Orient Express', 'Mystery', 256, '1934-01-01'),
(3, 'And Then There Were None', 'Mystery', 272, '1939-11-06'),
(4, 'The Da Vinci Code', 'Thriller', 489, '2003-03-18'),
(4, 'Angels & Demons', 'Thriller', 616, '2000-05-01'),
(5, 'The Shining', 'Horror', 447, '1977-01-28'),
(5, 'It', 'Horror', 1138, '1986-09-15');
