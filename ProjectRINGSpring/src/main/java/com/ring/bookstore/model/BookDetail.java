package com.ring.bookstore.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

import java.time.LocalDateTime;

import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class BookDetail {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue
    @JsonIgnore
    private Integer id;

    @Column
    private Double bWeight;

    @Column(length = 50)
    private String size;

    @Column
    private Integer pages;

    @Column
    private LocalDateTime bDate;

    @Column(length = 100)
    @Nationalized 
    private String bLanguage;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnore
    private Book book;

}
