package com.ring.bookstore.model.entity;

import com.ring.bookstore.model.enums.BookLanguage;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Represents an entity as {@link BookDetail} for book details.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDetail {

    @Id
    @Column(nullable = false, updatable = false)
    @JsonIgnore
    private Long id;

    @Column
    private Double bWeight;

    @Column(length = 50)
    private String size;

    @Column
    private Integer pages;

    @Column
    private LocalDate bDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private BookLanguage bLanguage;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Book book;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "detail",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Image> previewImages;

    public void addImage(Image image) {
        previewImages.add(image);
        image.setDetail(this);
    }

    public void removeImage(Image image) {
        previewImages.remove(image);
        image.setDetail(null);
    }
}
