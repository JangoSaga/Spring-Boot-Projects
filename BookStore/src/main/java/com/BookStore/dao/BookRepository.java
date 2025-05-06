package com.BookStore.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BookStore.Entity.Book;

public interface BookRepository extends JpaRepository<Book, Integer> {

    Optional<Book> findByTitle(String title);

    List<Book> findByGenres(String Genre);

    List<Book> findByPagesLessThan(int pages);

    List<Book> findByPagesGreaterThan(int pages);

    List<Book> findByPagesBetween(int startPage, int endPage);

    List<Book> findByDateBetween(LocalDate startDate, LocalDate endDate);

}
