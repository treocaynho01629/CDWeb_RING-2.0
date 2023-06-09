package com.ring.bookstore.controller;

import java.util.List;

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
import com.ring.bookstore.dtos.OrderDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.request.OrderRequest;
import com.ring.bookstore.response.IChartResponse;
import com.ring.bookstore.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController { //Controller Đơn hàng
	
	private final OrderService orderService;
	
	//Đặt hàng
	@PostMapping
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<OrderReceipt> checkout(@RequestBody @Valid OrderRequest request,
												@CurrentAccount Account currUser
    ) {
		  OrderReceipt orderReceipt = orderService.checkout(request, currUser);
          return new ResponseEntity< >(orderReceipt, HttpStatus.CREATED);
    }
	
	//Lấy tất cả Đơn hàng
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getAllOrders(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
    										@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
        									@CurrentAccount Account currUser){
        Page<OrderDTO> orders =  orderService.getAllOrders(currUser, pageNo, pageSize, sortBy, sortDir);
        return new ResponseEntity< >(orders, HttpStatus.OK);
    }
	
	//Lấy Đơn hàng theo {id}
	@GetMapping("{id}")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Integer id){
		OrderDTO order =  orderService.getOrderById(id);
        return new ResponseEntity< >(order, HttpStatus.OK);
    }
	
	//Lấy Đơn hàng theo Người dùng hiện tại
	@GetMapping("/user")
	@PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getOrdersByUser(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
        									@CurrentAccount Account currUser){
        Page<OrderDTO> orders =  orderService.getOrdersByUser(currUser, pageNo, pageSize);
        return new ResponseEntity< >(orders, HttpStatus.OK);
    }
	
	//Lấy Đơn hàng theo {id} Sách
	@GetMapping("/book/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getOrdersByBookId(@PathVariable("id") Integer id,
    										@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
    										@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir){
        Page<OrderDTO> orders =  orderService.getOrdersByBookId(id, pageNo, pageSize, sortBy, sortDir);
        return new ResponseEntity< >(orders, HttpStatus.OK);
    }

	//Lấy dữ liệu Doanh thu cho biểu đồ
	@GetMapping("/sale")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> getMonthlySale(@CurrentAccount Account currUser){
        List<IChartResponse> chart =  orderService.getMonthlySale(currUser);
        return new ResponseEntity< >(chart, HttpStatus.OK);
    }
}
