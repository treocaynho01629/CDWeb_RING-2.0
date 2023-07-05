package com.ring.bookstore.dtos.mappers;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.OrderDTO;
import com.ring.bookstore.dtos.OrderDetailDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.OrderDetail;
import com.ring.bookstore.model.OrderReceipt;

@Service
public class OrderMapper implements Function<OrderReceipt, OrderDTO> {
	
	@Autowired
	private OrderDetailMapper detailMapper;
	
    @Override
    public OrderDTO apply(OrderReceipt order) {
    	
    	List<OrderDetail> orderDetails = order.getOrderOrderDetails();
    	List<OrderDetailDTO> detailsDTO = orderDetails.stream().map(detailMapper::apply).collect(Collectors.toList());
    	
    	Account user = order.getUser();
    	String userName = "Người dùng RING!";
    	if (user != null) userName = user.getUsername();
        
    	return new OrderDTO(order.getFullName(), 
        		order.getEmail(), 
        		order.getPhone(),
        		order.getOAddress(),
        		order.getOMessage(),
        		order.getODate(),
        		order.getTotal(),
        		userName,
        		detailsDTO
		);
    }
}
