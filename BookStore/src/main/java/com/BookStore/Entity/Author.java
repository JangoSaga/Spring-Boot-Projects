package com.BookStore.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Authors")
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "a_id")
    private int id;

    @Column(name = "a_name")
    private String aName;

    @Column(name = "a_genre")
    private String aGenre;

    public Author() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAuthorName() {
        return aName;
    }

    public void setAuthorName(String aName) {
        this.aName = aName;
    }

    public String getAuthorGenre() {
        return aGenre;
    }

    public void setAuthorGenre(String aGenre) {
        this.aGenre = aGenre;
    }

}
