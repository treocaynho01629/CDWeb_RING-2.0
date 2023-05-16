package com.ring.bookstore.service;

import org.springframework.data.domain.Page;

import com.ring.bookstore.dtos.OrderDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.request.OrderRequest;

public interface OrderService {
	
	Page<OrderDTO> getAllOrders(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<OrderDTO> getOrdersByBookId(Integer id, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<OrderDTO> getOrdersByUser(Account user, Integer pageNo, Integer pageSize);
	OrderDTO getOrderById(Integer id);
	public OrderReceipt checkout(OrderRequest request, Account user);
}
