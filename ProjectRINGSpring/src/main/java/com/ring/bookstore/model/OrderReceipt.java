package com.ring.bookstore.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class OrderReceipt { //Đơn hàng

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
    private Integer id;

    @Column(length = 200)
    @Nationalized 
    private String fullName;

    @Column(length = 1000)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(length = 1000)
    @Nationalized 
    private String oAddress;

    @Column(length = 1000)
    @Nationalized 
    private String oMessage;

    @Column
    private LocalDateTime oDate;

    @Column
    private Double total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Account user;

    @OneToMany(cascade = CascadeType.ALL, 
    		orphanRemoval = true,  
    		mappedBy = "order", 
    		fetch = FetchType.LAZY)
    @LazyCollection(LazyCollectionOption.EXTRA)
    @JsonIgnore
    private List<OrderDetail> orderOrderDetails;

    public void addOrderDetail(OrderDetail detail) {
    	orderOrderDetails.add(detail);
    	detail.setOrder(this);
    }
 
    public void removeOrderDetail(OrderDetail detail) {
    	orderOrderDetails.remove(detail);
    	detail.setOrder(null);
    }
}
