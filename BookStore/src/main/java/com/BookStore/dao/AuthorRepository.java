package com.BookStore.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BookStore.Entity.Author;

public interface AuthorRepository extends JpaRepository<Author, Integer> {

    Optional<Author> findByAName(String authorName);

    List<Author> findByAGenre(String authorGenre);
}
