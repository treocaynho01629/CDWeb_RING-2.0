package com.ring.bookstore.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import java.util.Set;

import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Book {

    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Integer id;

    @Column(length = 500)
    private String image;

    @Column
    private Double price;

    @Column
    private Integer amount;

    @Column(length = 200)
    @Nationalized 
    private String title;

    @Column(length = 4000)
    @Nationalized 
    private String description;

    @Column(length = 200)
    @Nationalized 
    private String type;

    @Column(length = 200)
    @Nationalized 
    private String author;

    @Column
    private Integer sellId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    @JsonIgnore
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cate_id")
    @JsonIgnore
    private Category cate;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private Set<BookDetail> bookBookDetails;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private Set<Review> bookReviews;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private Set<OrderDetail> bookOrderDetails;

}
