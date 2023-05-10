package com.ring.bookstore.service.impl;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.CartItem;
import com.ring.bookstore.model.OrderDetail;
import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.repository.OrderDetailRepository;
import com.ring.bookstore.repository.OrderReceiptRepository;
import com.ring.bookstore.request.OrderRequest;
import com.ring.bookstore.service.OrderService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {
	
	private final OrderReceiptRepository orderRepo;
	private final OrderDetailRepository orderDetailRepo;
	private final BookRepository bookRepo;
	
	//Đặt sách
	@Transactional
	public OrderReceipt checkout(OrderRequest request, Account user) {
		
		//Xử lý data từ request
		String fullName = request.getFirstName() + " " + request.getLastName();
		double total = 0.0; //Tổng tiền
		Set<OrderDetail> details = new HashSet<OrderDetail>();
		
		//Check giỏ hàng
		if (request.getCart() != null && request.getCart().size() == 0) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Empty cart!");
		
		//Tạo OrderDetail cho từng SP
		for (CartItem i : request.getCart()) {
			
			//Kiểm tra sản phẩm có tồn tại trong database
			var book = bookRepo.findById(i.getId())
			            .orElseThrow(()-> new ResourceNotFoundException("Product does not exists!"));
			
			total += (i.getQuantity() * book.getPrice()) * 1.1 + 10000;
			
			var orderDetail = OrderDetail.builder()
					.amount(i.getQuantity())
					.price(book.getPrice())
					.book(book)
					.build();
			
			details.add(orderDetail);
		}
		
		//Tạo Order
		var orderReceipt = OrderReceipt.builder()
				.fullName(fullName)
				.email(user.getEmail())
				.phone(request.getPhone())
				.oAddress(request.getAddress())
				.oMessage(request.getMessage())
				.oDate(LocalDateTime.now())
				.user(user)
				.total(total)
				.build();
		
		OrderReceipt savedOrder = orderRepo.save(orderReceipt); //Save
		for (OrderDetail od : details) {
			od.setOrder(orderReceipt); //Set order
			orderDetailRepo.save(od); //Save
		}
		
		return savedOrder;
	}
}
