package com.ring.bookstore.controller;

import com.ring.bookstore.dtos.orders.CalculateDTO;
import com.ring.bookstore.dtos.orders.DetailOrderDTO;
import com.ring.bookstore.request.CalculateRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.dtos.orders.OrderDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.request.OrderRequest;
import com.ring.bookstore.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
	
	private final OrderService orderService;

	//Calculate price
	@PostMapping("/calculate")
	public ResponseEntity<CalculateDTO> calculate(@RequestBody @Valid CalculateRequest request) {
		CalculateDTO calculateResult = orderService.calculate(request);
		return new ResponseEntity< >(calculateResult, HttpStatus.CREATED);
	}
	
	//Commit order
	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<OrderReceipt> checkout(@RequestBody @Valid OrderRequest request,
												@CurrentAccount Account currUser
    ) {
		  OrderReceipt orderReceipt = orderService.checkout(request, currUser);
          return new ResponseEntity< >(orderReceipt, HttpStatus.CREATED);
    }
	
	//Get all orders
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getAllOrders(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
    										@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
        									@CurrentAccount Account currUser){
        Page<OrderDTO> orders = orderService.getAllOrders(currUser, pageNo, pageSize, sortBy, sortDir);
        return new ResponseEntity< >(orders, HttpStatus.OK);
    }
	
	//Get order by {id}
	@GetMapping("{id}")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Long id){
		OrderDTO order = orderService.getOrderById(id);
        return new ResponseEntity< >(order, HttpStatus.OK);
    }

    //Get order by {id}
    @GetMapping("/detail/{id}")
    @PreAuthorize("hasAnyRole('USER')")
    public ResponseEntity<?> getOrderDetailById(@PathVariable("id") Long id){
        DetailOrderDTO order = orderService.getDetailOrder(id);
        return new ResponseEntity< >(order, HttpStatus.OK);
    }
	
	//Get orders from user
	@GetMapping("/user")
	@PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getOrdersByUser(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
        									@CurrentAccount Account currUser){
        Page<OrderDTO> orders = orderService.getOrdersByUser(currUser, pageNo, pageSize);
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
