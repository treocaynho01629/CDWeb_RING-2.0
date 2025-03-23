package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "image")
public class Image {
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
    private Long id;

    @Column(unique = true, name = "name")
    private String name;

    @Column(unique = true)
    private String publicId;

    @Column(name = "url")
    private String url;

    @Column(name = "type")
    private String type;

    //Image relation
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detail_id")
    @JsonIgnore
    private BookDetail detail;
}
