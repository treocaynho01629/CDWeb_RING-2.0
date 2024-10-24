package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE Coupon SET active = false WHERE id=?")
@Where(clause = "active=true")
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
            orphanRemoval = true,
            mappedBy = "coupon")
    @JsonManagedReference
    private CouponDetail detail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    @JsonIgnore
    private Shop shop;

    @Transient
    private Boolean isUsable = false;

    public Long getShopId() {
        return (this.shop != null) ? this.shop.getId() : null;
    }
}
