package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.ring.bookstore.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import java.util.List;

@Entity
@Data
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
    @LazyCollection(LazyCollectionOption.EXTRA)
    @JsonIgnore
    private List<OrderItem> items;

    public void addOrderItem(OrderItem item) {
        items.add(item);
        item.setDetail(this);
    }

    public void removeOrderItem(OrderItem item) {
        items.remove(item);
        item.setDetail(null);
    }
}
