package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.dtos.orders.*;
import com.ring.bookstore.dtos.dashboard.ChartDTO;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.request.CalculateRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;

import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.OrderRequest;

public interface OrderService {
	
	Page<ReceiptDTO> getAllReceipts(Account user,
									Long shopId,
									Integer pageNo,
									Integer pageSize,
									String sortBy,
									String sortDir);
	Page<ReceiptSummaryDTO> getSummariesWithFilter(Account user,
												   Long shopId,
												   Long bookId,
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
	StatDTO getAnalytics(Account user, Long shopId);
	CalculateDTO calculate(CalculateRequest request);
	ReceiptDTO checkout(OrderRequest checkRequest,
						HttpServletRequest request,
						Account user);
	List<ChartDTO> getMonthlySales(Account user, Long shopId, Integer year);
}
