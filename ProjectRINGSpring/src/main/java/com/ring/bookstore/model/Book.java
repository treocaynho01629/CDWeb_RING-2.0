package com.ring.bookstore.model;

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

import java.util.List;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.annotations.Nationalized;

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
@EqualsAndHashCode
@Table(indexes = @Index(columnList = "title"))
public class Book { //Sách

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
    
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", nullable = true)
    @JsonIgnore 
    private Image images;
    
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sell_id")
    @JsonIgnore 
    private Account user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cate_id")
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

    @OneToMany(cascade = CascadeType.ALL, 
    		orphanRemoval = true, 
    		mappedBy = "book", 
    		fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.EXTRA)
    @JsonIgnore
    private List<OrderDetail> orderDetails;
    
    public void addReview(Review review) {
    	bookReviews.add(review);
    	review.setBook(this);
    }
 
    public void removeReview(Review review) {
    	bookReviews.remove(review);
        review.setBook(null);
    }
    
    public void addOrderDetail(OrderDetail detail) {
    	orderDetails.add(detail);
    	detail.setBook(this);
    }
 
    public void removeOrderDetail(OrderDetail detail) {
    	orderDetails.remove(detail);
    	detail.setBook(null);
    }
}
