package com.ring.bookstore.controller;

import com.ring.bookstore.dtos.orders.CalculateDTO;
import com.ring.bookstore.dtos.orders.OrderDetailDTO;
import com.ring.bookstore.dtos.orders.OrderDTO;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.request.CalculateRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.dtos.orders.ReceiptDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.OrderRequest;
import com.ring.bookstore.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
	
	private final OrderService orderService;

	private final AccountRepository accRepo;

	//Calculate price
	@PostMapping("/calculate")
	public ResponseEntity<CalculateDTO> calculate(@RequestBody @Valid CalculateRequest request) {
		CalculateDTO calculateResult = orderService.calculate(request);
		return new ResponseEntity< >(calculateResult, HttpStatus.CREATED);
	}
	
	//Commit order
	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<ReceiptDTO> checkout(@RequestBody @Valid OrderRequest checkRequest,
											   	HttpServletRequest request,
												@CurrentAccount Account currUser
    ) {
		ReceiptDTO result = orderService.checkout(checkRequest, request, currUser);
          return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
	
	//Get all orders
	@GetMapping("/receipts")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getAllOrders(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
    										@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
        									@CurrentAccount Account currUser){
        Page<ReceiptDTO> orders = orderService.getAllReceipts(currUser, pageNo, pageSize, sortBy, sortDir);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
	
	//Get order by {id}
	@GetMapping("/receipts/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getReceipt(@PathVariable("id") Long id){
		ReceiptDTO receipt = orderService.getReceipt(id);
        return new ResponseEntity< >(receipt, HttpStatus.OK);
    }

    //Get order by {id}
    @GetMapping("/detail/{id}")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<?> getOrderDetail(@PathVariable("id") Long id){
        OrderDetailDTO order = orderService.getOrderDetail(id);
        return new ResponseEntity< >(order, HttpStatus.OK);
    }
	
	//Get orders from user
	@GetMapping("/user")
	@PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getOrdersByUser(@RequestParam(value = "status", defaultValue = "") OrderStatus status,
											@RequestParam(value = "keyword", defaultValue = "") String keyword,
											@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
        									@CurrentAccount Account currUser){
        Page<OrderDTO> orders = orderService.getOrdersByUser(currUser, status, keyword, pageNo, pageSize);
		return new ResponseEntity< >(orders, HttpStatus.OK);
    }
	
	//Get orders for book's {id}
	@GetMapping("/book/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getOrdersByBookId(@PathVariable("id") Long id,
    										@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
    										@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir){
        Page<OrderDTO> orders = orderService.getOrdersByBookId(id, pageNo, pageSize, sortBy, sortDir);
        return new ResponseEntity< >(orders, HttpStatus.OK);
    }

	//Get orders chart
	@GetMapping("/sale")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getMonthlySale(@CurrentAccount Account currUser){
        return new ResponseEntity< >(orderService.getMonthlySale(currUser), HttpStatus.OK);
    }
}
