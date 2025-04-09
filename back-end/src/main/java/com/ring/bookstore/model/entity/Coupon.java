package com.ring.bookstore.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

/**
 * Represents an entity as {@link Coupon} for coupons.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE Coupon SET active = false WHERE id=?")
@SQLRestriction("active=true")
@EqualsAndHashCode(callSuper = true)
public class Coupon extends Auditable {

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

    @Column(length = 50, nullable = false, unique = true)
    private String code;

    @OneToOne(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            mappedBy = "coupon",
            orphanRemoval = true,
            optional = false)
    @PrimaryKeyJoinColumn
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private CouponDetail detail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    @JsonIgnore
    private Shop shop;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            mappedBy = "coupon",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderReceipt> couponReceipts;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST},
            mappedBy = "coupon",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderDetail> couponOrderDetails;

    @Transient
    private Boolean isUsable = false;

    @Transient
    private Boolean isUsed = false;
}
