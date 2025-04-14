package com.ring.bookstore.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Set;

import lombok.*;
import org.hibernate.annotations.Nationalized;

/**
 * Represents an entity as {@link Publisher} for publishers.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Publisher {

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

    @Column(length = 200)
    @Nationalized 
    private String name;

    @OneToOne(fetch = FetchType.LAZY,
            orphanRemoval = true,
            cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    @JsonIgnore
    private Image image;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            mappedBy = "publisher",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Book> publisherBooks;

    public void addBook(Book book) {
        publisherBooks.add(book);
        book.setPublisher(this);
    }

    public void removeBook(Book book) {
        publisherBooks.remove(book);
        book.setPublisher(null);
    }

    public void removeAllBooks() {
        publisherBooks.forEach(book -> book.setPublisher(null));
        this.publisherBooks.clear();
    }

    @PreRemove
    private void detachBooksFromPublisher() {
        this.removeAllBooks();
    }
}
