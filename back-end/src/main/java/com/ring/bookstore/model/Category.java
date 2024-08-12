package com.ring.bookstore.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.Set;

import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Category {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    private Integer id;

    @Column(length = 200)
    @Nationalized 
    private String categoryName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "cate", fetch = FetchType.LAZY)
    private Set<Sub> cateSubs;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "cate")
    @JsonIgnore
    private Set<Book> cateBooks;

}
