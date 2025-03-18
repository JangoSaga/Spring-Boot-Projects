package com.BookStore.Entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @Column(name = "a_id")
    private int a_id;

    @Column(name = "genres")
    private String genres;

    @Column(name = "pages")
    private int pages;

    @Column(name = "p_date")
    private Date date;

    public Book(Date date, String genres, int pages, String title) {
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

    public int getA_id() {
        return a_id;
    }

    public void setA_id(int a_id) {
        this.a_id = a_id;
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

    public Date getDate() {
        return date;
    }

    @Override
    public String toString() {
        return "Book [b_id=" + b_id + ", title=" + title + ", a_id=" + a_id + ", genres=" + genres + ", pages=" + pages
                + ", date=" + date + "]";
    }

    public void setDate(Date date) {
        this.date = date;
    }

}
