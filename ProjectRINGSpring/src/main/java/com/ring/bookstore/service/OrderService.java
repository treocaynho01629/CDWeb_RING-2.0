package com.ring.bookstore.service;

import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.request.OrderRequest;

public interface OrderService {
	
	public OrderReceipt checkout(OrderRequest request);
}
