package com.BookStore.rest;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BookStore.Entity.Book;
import com.BookStore.service.BookStoreService;

@RestController
@RequestMapping("/bookStore")
public class BookStoreRestController {

    private final BookStoreService bookStoreService;

    public BookStoreRestController(BookStoreService bookStoreService) {
        this.bookStoreService = bookStoreService;
    }

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookStoreService.getAllBooks();
    }

    @GetMapping("/books/id/{bookId}")
    public Book getBookById(@PathVariable int bookId) {
        return bookStoreService.getBookById(bookId);
    }

    @GetMapping("/books/title/{bookName}")
    public Book getBookByName(@PathVariable String bookName) {
        return bookStoreService.getBookByName(bookName);
    }
}
