package com.BookStore.service;

import java.util.List;

import com.BookStore.Entity.Book;

public interface BookStoreService {

    List<Book> getAllBooks();

    Book getBookById(int theId);

    Book getBookByName(String bookName);

}
