package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ring.bookstore.enums.CouponType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponDetail {

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    @JsonBackReference
    private Coupon coupon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CouponType type;

    @Column(nullable = false)
    private Double attribute; //Min money/quantity

    @Column
    private Double maxDiscount;

    @Column(precision = 5, scale = 4, nullable = false)
    private BigDecimal discount;

    @Column
    private Short usage;

    @Column
    private LocalDate expDate;
}
