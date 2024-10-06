package com.ring.bookstore.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDetail {
    private Long shopId;
    private String coupon;
    private List<CartItem> items;
}
