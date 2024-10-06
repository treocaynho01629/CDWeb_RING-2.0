package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.dtos.ChartDTO;
import com.ring.bookstore.request.CalculateRequest;
import org.springframework.data.domain.Page;

import com.ring.bookstore.dtos.OrderDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.request.OrderRequest;

public interface OrderService {
	
	Page<OrderDTO> getAllOrders(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<OrderDTO> getOrdersByBookId(Long id, Integer pageNo, Integer pageSize, String sortBy, String sortDir);
	Page<OrderDTO> getOrdersByUser(Account user, Integer pageNo, Integer pageSize);
	OrderDTO getOrderById(Long id);
	OrderDTO calculate(CalculateRequest request);
	OrderReceipt checkout(OrderRequest request, Account user);
	List<ChartDTO> getMonthlySale(Account user);
}
