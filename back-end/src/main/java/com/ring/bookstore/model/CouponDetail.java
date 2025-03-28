package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ring.bookstore.dtos.coupons.CouponDTO;
import com.ring.bookstore.enums.CouponType;
import jakarta.persistence.*;
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
    @JsonIgnore
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
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
