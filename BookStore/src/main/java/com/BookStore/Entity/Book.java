package com.BookStore.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Books")
public class Book {

    /*
     * Books contains:
     * - Title
     * - Author(s)
     * - Genres
     * - Pages
     * - Publish date
     * 
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "b_id")
    private int b_id;

    @Column(name = "title")
    private String title;

    @Column(name = "genres")
    private String genres;

    @ManyToOne
    @JoinColumn(name = "a_id", nullable = false)
    private Author author;

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    @Column(name = "pages")
    private int pages;

    @Column(name = "p_date")
    private LocalDate date;

    public Book(LocalDate date, String genres, int pages, String title) {
        this.date = date;
        this.genres = genres;
        this.pages = pages;
        this.title = title;
    }

    public Book() {

    }

    public int getB_id() {
        return b_id;
    }

    public void setB_id(int b_id) {
        this.b_id = b_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

}
