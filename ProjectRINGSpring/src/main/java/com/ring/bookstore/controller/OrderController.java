package com.ring.bookstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.Account;
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
	
	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<OrderReceipt> checkout( //Tạo tài khoản
          @RequestBody @Valid OrderRequest request,
          @CurrentAccount Account currUser
    ) {
		  OrderReceipt orderReceipt = orderService.checkout(request, currUser);
          return new ResponseEntity< >(orderReceipt, HttpStatus.CREATED);
    }

}
