package com.BookStore.service;

import java.time.LocalDate;
import java.util.List;

import com.BookStore.Entity.Author;
import com.BookStore.Entity.Book;

public interface BookStoreService {

// BOOK 
    List<Book> getAllBooks();

    Book getBookById(int theId);

    Book getBookByName(String bookName);

    List<Book> getBookByGenres(String Genres);

    List<Book> getBookByPagesLessThan(int pages);

    List<Book> getBookByPagesGreaterThan(int pages);

    List<Book> getBooksByPagesBetween(int startPage, int endPage);

    List<Book> getBooksBetweenDates(LocalDate startDate, LocalDate endDate);

// Author
    List<Author> getAllAuthors();

    Author getAuthorById(int theId);

    Author getAuthorByName(String authorName);

    List<Author> getAuthorByGenre(String genre);

}
