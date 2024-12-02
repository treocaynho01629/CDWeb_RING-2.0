package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.ring.bookstore.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class OrderDetail {

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

    @Column
    private Double totalPrice;

    @Column
    private Double shippingFee;

    @Column
    private Double shippingDiscount;

    @Column
    private Double discount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private OrderReceipt order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    @JsonIgnore
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    @JsonIgnore
    private Coupon coupon;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "detail",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderItem> items;

    //For mapping result
    @Transient
    private Double couponDiscount;

    public void addOrderItem(OrderItem item) {
        items.add(item);
        item.setDetail(this);
    }

    public void removeOrderItem(OrderItem item) {
        items.remove(item);
        item.setDetail(null);
    }
}
