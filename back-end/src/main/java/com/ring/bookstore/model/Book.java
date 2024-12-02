package com.ring.bookstore.model;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE Book SET active = false WHERE id=?")
@SQLRestriction("active=true")
@EqualsAndHashCode(callSuper = true)
@Table(indexes = @Index(columnList = "title"))
public class Book extends Auditable {

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

    @OneToOne(fetch = FetchType.LAZY,
            orphanRemoval = true,
            cascade = CascadeType.ALL,
            optional = false)
    @JoinColumn(name = "image_id", nullable = false)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Image image;

    @Column
    private Double price;

    @Column(precision = 5, scale = 4)
    private BigDecimal discount;

    @Column
    private Short amount;

    @Column(length = 200, unique = true)
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

    @Column(unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    @JsonIgnore
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    @JsonIgnore
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cate_id")
    @JsonIgnore
    private Category cate;

    @OneToOne(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "book",
            orphanRemoval = true,
            optional = false)
    @PrimaryKeyJoinColumn
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private BookDetail detail;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "book",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> bookReviews;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            mappedBy = "book",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderItem> orderItems;

    public Long getImageId() {
        return (this.image != null) ? this.image.getId() : null;
    }
    public Long getShopId() {
        return (this.shop != null) ? this.shop.getId() : null;
    }

    public void addReview(Review review) {
        bookReviews.add(review);
        review.setBook(this);
    }

    public void removeReview(Review review) {
        bookReviews.remove(review);
        review.setBook(null);
    }
}
