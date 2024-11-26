package com.ring.bookstore.model;

import com.ring.bookstore.enums.PaymentType;
import com.ring.bookstore.enums.ShippingType;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.CreatedDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class OrderReceipt {

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

    @Column(length = 200)
    @Nationalized 
    private String fullName;

    @Column(length = 1000)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(length = 1000)
    @Nationalized 
    private String orderAddress;

    @Column(length = 1000)
    @Nationalized 
    private String orderMessage;

    @Column(name="order_date", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime orderDate;

    @Column
    private Double total;

    @Column
    private Double totalDiscount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Account user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    @JsonIgnore
    private Coupon coupon;

    @OneToMany(cascade = CascadeType.ALL, 
    		orphanRemoval = true,  
    		mappedBy = "order", 
    		fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.EXTRA)
    @JsonIgnore
    private List<OrderDetail> details;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ShippingType shippingType;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private PaymentType paymentType;

    //For mapping result
    @Transient
    private Double productsPrice;

    @Transient
    private Double shippingFee;

    @Transient
    private Double shippingDiscount;

    @Transient
    private Double dealDiscount;

    @Transient
    private Double couponDiscount;

    public void addOrderDetail(OrderDetail detail) {
        details.add(detail);
    	detail.setOrder(this);
    }
 
    public void removeOrderDetail(OrderDetail detail) {
        details.remove(detail);
    	detail.setOrder(null);
    }
}
