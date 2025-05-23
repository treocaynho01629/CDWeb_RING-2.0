package com.ring.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ring.dto.response.coupons.CouponDTO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

/**
 * Represents an entity as {@link OrderReceipt} for order receipts.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE OrderReceipt SET active = false WHERE id=?")
@SQLRestriction("active=true")
@EqualsAndHashCode(callSuper = true)
public class OrderReceipt extends Auditable {

    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(name = "primary_sequence", sequenceName = "primary_sequence", allocationSize = 1, initialValue = 10000)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "primary_sequence")
    private Long id;

    @Column(length = 200)
    private String email;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    @JsonIgnore
    private Address address;

    @Column
    private Double total; // Products price - deal + shipping fee

    @Column
    private Double totalDiscount; // Coupon discount + deal + shipping discount

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Account user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    @JsonIgnore
    private Coupon coupon;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "order", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderDetail> details;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    @JsonIgnore
    private PaymentInfo payment;

    // For mapping DTO result
    @Transient
    private Double productsPrice;

    @Transient
    private Double shippingFee;

    @Transient
    private Double shippingDiscount;

    @Transient
    private Double dealDiscount; // Product's discount * price

    @Transient
    private Double couponDiscount;

    @Transient
    private CouponDTO couponDTO;

    public void addOrderDetail(OrderDetail detail) {
        this.details.add(detail);
        detail.setOrder(this);
    }

    public void removeOrderDetail(OrderDetail detail) {
        this.details.remove(detail);
        detail.setOrder(null);
    }

    public void removeAllOrderDetails() {
        details.forEach(detail -> detail.setOrder(null));
        this.details.clear();
    }
}
