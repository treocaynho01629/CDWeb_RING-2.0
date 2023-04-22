package com.ring.bookstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.request.OrderRequest;
import com.ring.bookstore.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
	
	private final OrderService orderService;
	
	@PostMapping()
	public ResponseEntity<OrderReceipt> checkout( //Tạo tài khoản
          @RequestBody @Valid OrderRequest request
    ) {
		  OrderReceipt orderReceipt = orderService.checkout(request);
          return new ResponseEntity< >(orderReceipt, HttpStatus.CREATED);
    }

}
