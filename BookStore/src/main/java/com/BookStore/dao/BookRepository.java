package com.BookStore.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BookStore.Entity.Book;

public interface BookRepository extends JpaRepository<Book, Integer> {

    Optional<Book> findByTitle(String title);

}
