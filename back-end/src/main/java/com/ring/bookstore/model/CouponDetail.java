package com.ring.bookstore.model;

import com.ring.bookstore.enums.CouponType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CouponType type;

    @Column
    private Double attribute; //Min money/quantity

    @Column(nullable = false)
    private Double maxDiscount;

    @Column(nullable = false)
    private BigDecimal discountPercent;

    @Column
    private Short usage;

    @Column
    private LocalDate expDate;
}
