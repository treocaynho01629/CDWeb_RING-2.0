package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE Shop SET active = false WHERE id=?")
@Where(clause = "active=true")
@EqualsAndHashCode(callSuper = true)
public class Shop extends Auditable {
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
    @JsonIgnore
    private Long id;
	
	@Column(length = 250)
	@Nationalized 
    private String name;

	@Column(length = 500)
    @Nationalized
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private Account owner;

    @OneToOne(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    @JoinColumn(name = "image_id")
    private Image image;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            mappedBy = "shop",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Book> books;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "shop",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Coupon> coupons;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            fetch = FetchType.LAZY)
    @JoinTable(	name = "following",
            joinColumns = @JoinColumn(name = "shop_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id"))
    @JsonIgnore
    private List<Account> followers;

    public void removeAllBooks() {
        books.forEach(book -> book.setShop(null));
        this.books.clear();
    }
}
