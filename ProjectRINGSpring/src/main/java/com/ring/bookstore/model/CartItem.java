package com.ring.bookstore.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItem { //Sản phẩm trong Giỏ hàng
	
	private Integer id;
	private String title;
	private Integer quantity;
	private Double price;
}
