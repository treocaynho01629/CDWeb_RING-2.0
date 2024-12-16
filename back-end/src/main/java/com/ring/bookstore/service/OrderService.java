package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.dtos.orders.CalculateDTO;
import com.ring.bookstore.dtos.ChartDTO;
import com.ring.bookstore.dtos.orders.OrderDetailDTO;
import com.ring.bookstore.dtos.orders.OrderDTO;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.request.CalculateRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;

import com.ring.bookstore.dtos.orders.ReceiptDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.request.OrderRequest;

public interface OrderService {
	
	Page<ReceiptDTO> getAllReceipts(Account user,
									Integer pageNo,
									Integer pageSize,
									String sortBy,
									String sortDir);
	Page<OrderDTO> getOrdersByBookId(Long id,
									 Integer pageNo,
									 Integer pageSize,
									 String sortBy,
									 String sortDir);
	Page<OrderDTO> getOrdersByUser(Account user,
								   OrderStatus status,
								   String keyword,
								   Integer pageNo,
								   Integer pageSize);
	ReceiptDTO getReceipt(Long id);
	OrderDetailDTO getOrderDetail(Long id);
	CalculateDTO calculate(CalculateRequest request);
	ReceiptDTO checkout(OrderRequest checkRequest,
						HttpServletRequest request,
						Account user);
	List<ChartDTO> getMonthlySale(Account user);
}
