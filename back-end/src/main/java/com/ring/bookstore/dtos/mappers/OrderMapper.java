package com.ring.bookstore.dtos.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.OrderDTO;
import com.ring.bookstore.dtos.OrderDetailDTO;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class OrderMapper {

    public OrderDTO orderToOrderDTO(OrderReceipt order) {
    	
    	List<OrderDetail> orderDetails = order.getDetails();
    	List<OrderDetailDTO> detailsDTO = orderDetails.stream().map(this::detailToDetailDTO).collect(Collectors.toList());
    	
    	Account user = order.getUser();
    	String username = "Người dùng RING!";
    	if (user != null) username = user.getUsername();
        
    	return new OrderDTO(order.getId(),
				order.getFullName(),
        		order.getEmail(), 
        		order.getPhone(),
        		order.getOrderAddress(),
        		order.getOrderMessage(),
        		order.getOrderDate(),
        		order.getTotal(),
        		username,
        		detailsDTO
		);
    }

	public OrderDetailDTO detailToDetailDTO(OrderDetail detail) {

		Book book = detail.getBook();
		Shop shop = book.getShop();

		String fileDownloadUri = ServletUriComponentsBuilder
				.fromCurrentContextPath()
				.path("/api/images/")
				.path(book.getImage().getName())
				.toUriString();

		return new OrderDetailDTO(detail.getId(),
				shop.getId(),
				shop.getName(),
				detail.getAmount(),
				detail.getPrice(),
				book.getId(),
				book.getSlug(),
				detail.getStatus(),
				fileDownloadUri,
				book.getTitle());
	}
}
