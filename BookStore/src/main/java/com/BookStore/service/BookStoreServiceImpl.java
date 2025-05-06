package com.BookStore.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.BookStore.Entity.Author;
import com.BookStore.Entity.Book;
import com.BookStore.dao.AuthorRepository;
import com.BookStore.dao.BookRepository;

@Service
public class BookStoreServiceImpl implements BookStoreService {

    private final BookRepository bookRepository;

    private final AuthorRepository authorRepository;

    public BookStoreServiceImpl(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(int theId) {
        Optional<Book> result = bookRepository.findById(theId);
        Book theBook = null;
        if (result.isPresent()) {
            theBook = result.get();
        } else {
            throw new RuntimeException("Did not find book - " + theBook);
        }
        return theBook;
    }

    @Override
    public Book getBookByName(String bookName) {

        Optional<Book> result = bookRepository.findByTitle(bookName);
        return result.orElseThrow(() -> new RuntimeException("Did not find book - " + bookName));
    }

    @Override
    public List<Book> getBookByGenres(String Genres) {
        List<Book> result = bookRepository.findByGenres(Genres);
        if (result.isEmpty()) {
            throw new RuntimeException("Did not find book with genre - " + Genres);
        }
        return result;
    }

    @Override
    public List<Book> getBookByPagesLessThan(int pages) {
        List<Book> result = bookRepository.findByPagesLessThan(pages);
        if (result.isEmpty()) {
            throw new RuntimeException("No book found with pages less than " + pages);
        }
        return result;
    }

    @Override
    public List<Book> getBookByPagesGreaterThan(int pages) {
        List<Book> result = bookRepository.findByPagesGreaterThan(pages);
        if (result.isEmpty()) {
            throw new RuntimeException("No book found with pages greater than " + pages);
        }
        return result;
    }

    @Override
    public List<Book> getBooksBetweenDates(LocalDate startDate, LocalDate endDate) {
        List<Book> books = bookRepository.findByDateBetween(startDate, endDate);
        if (books.isEmpty()) {
            throw new RuntimeException("No books found between " + startDate + " and " + endDate);
        }
        return books;
    }

    @Override
    public List<Book> getBooksByPagesBetween(int startPage, int endPage) {
        List<Book> books = bookRepository.findByPagesBetween(startPage, endPage);
        if (books.isEmpty()) {
            throw new RuntimeException("No books found between " + startPage + " and " + endPage);
        }
        return books;
    }

    @Override
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    @Override
    public Author getAuthorById(int theId) {
        Optional<Author> result = authorRepository.findById(theId);
        Author theAuthor = null;
        if (result.isPresent()) {
            theAuthor = result.get();
        } else {
            throw new RuntimeException("Did not find author - " + theAuthor);
        }
        return theAuthor;
    }

    @Override
    public Author getAuthorByName(String authorName) {
        Optional<Author> result = authorRepository.findByAName(authorName);
        return result.orElseThrow(() -> new RuntimeException("Did not find author - " + authorName));
    }

    @Override
    public List<Author> getAuthorByGenre(String genre) {
        List<Author> result = authorRepository.findByAGenre(genre);
        if (result.isEmpty()) {
            throw new RuntimeException("Did not find author with genre - " + genre);
        }
        return result;
    }

}
