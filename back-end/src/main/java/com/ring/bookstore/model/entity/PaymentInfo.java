package com.ring.bookstore.model.entity;

import com.ring.bookstore.model.enums.PaymentStatus;
import com.ring.bookstore.model.enums.PaymentType;
import jakarta.persistence.*;

import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDateTime;

/**
 * Represents an entity as {@link OrderReceipt} for order receipts.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfo {

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
    @Column(length = 30)
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private PaymentStatus status;

    @Column(length = 250)
    private String checkoutUrl;

    @Column
    private Integer amount;

    @Column(length = 500)
    private String description;

    @Column
    private LocalDateTime expiredAt;
}
