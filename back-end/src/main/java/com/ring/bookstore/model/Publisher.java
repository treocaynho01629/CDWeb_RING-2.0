package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Set;

import lombok.*;
import org.hibernate.annotations.Nationalized;


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
    private String pubName;

    @OneToOne(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @JoinColumn(name = "image_id")
    @JsonIgnore
    private Image image;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "publisher", fetch = FetchType.LAZY)
    @JsonBackReference
    private Set<Book> publisherBooks;

    public Long getImageId() {
        return (this.image != null) ? this.image.getId() : null;
    }
}
