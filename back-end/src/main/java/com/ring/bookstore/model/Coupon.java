package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

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

    @Transient
    private Boolean isUsable = false;
}
