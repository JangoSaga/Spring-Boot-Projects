package com.BookStore.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.BookStore.Entity.Book;
import com.BookStore.dao.BookRepository;

@Service
public class BookStoreServiceImpl implements BookStoreService {

    private final BookRepository bookRepository;

    public BookStoreServiceImpl(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
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

}
