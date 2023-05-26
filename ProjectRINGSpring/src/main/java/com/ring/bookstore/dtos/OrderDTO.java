package com.ring.bookstore.dtos;

import java.time.LocalDateTime;
import java.util.List;

//Hoá đơn
public record OrderDTO(String fullName, String email, String phone, String address, String message, 
		LocalDateTime date, Double total, String userName, List<OrderDetailDTO> orderDetails) {

}
