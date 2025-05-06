package com.BookStore.rest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.BookStore.Entity.Author;
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

    @GetMapping("/books/Genres/{genreName}")
    public List<Book> getBookByGenre(@PathVariable String genreName) {
        return bookStoreService.getBookByGenres(genreName);
    }

    @GetMapping("/books/Pages/LessThan/{pageCount}")
    public List<Book> getBooksByPagesLessThan(@PathVariable int pageCount) {
        return bookStoreService.getBookByPagesLessThan(pageCount);
    }

    @GetMapping("/books/Pages/GreaterThan/{pageCount}")
    public List<Book> getBooksByPagesGreaterThan(@PathVariable int pageCount) {
        return bookStoreService.getBookByPagesGreaterThan(pageCount);
    }

    @GetMapping("/books/Pages/Between")
    public ResponseEntity<List<Book>> getBooksByPagesRange(
            @RequestParam int startPage,
            @RequestParam int endPage) {
        return ResponseEntity.ok(bookStoreService.getBooksByPagesBetween(startPage, endPage));
    }

    @GetMapping("books/Dates")
    public ResponseEntity<List<Book>> getBooksByDateRange(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return ResponseEntity.ok(bookStoreService.getBooksBetweenDates(startDate, endDate));
    }

    @GetMapping("/authors")
    public List<Author> getAuthors() {
        return bookStoreService.getAllAuthors();
    }

    @GetMapping("/authors/name/{name}")
    public Author getAuthorByName(@PathVariable String name) {
        return bookStoreService.getAuthorByName(name);
    }

    @GetMapping("/authors/genre/{genre}")
    public List<Author> getAuthorByGenre(@PathVariable String genre) {
        return bookStoreService.getAuthorByGenre(genre);
    }

}
