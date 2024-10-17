package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.annotations.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@SQLDelete(sql = "UPDATE Book SET active = false WHERE id=?")
@Where(clause = "active=true")
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

    @OneToOne(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @JoinColumn(name = "image_id", nullable = false)
    @JsonIgnore
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "publisher_id")
    @JsonManagedReference
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cate_id")
    @JsonManagedReference
    private Category cate;

    @OneToOne(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "book")
    private BookDetail bookDetail;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "book",
            fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.EXTRA)
    @JsonIgnore
    private List<Review> bookReviews;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            mappedBy = "book",
            fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.EXTRA)
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
