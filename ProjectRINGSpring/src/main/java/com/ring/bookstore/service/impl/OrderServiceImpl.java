package com.ring.bookstore.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.OrderDTO;
import com.ring.bookstore.dtos.mappers.OrderMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.CartItem;
import com.ring.bookstore.model.OrderDetail;
import com.ring.bookstore.model.OrderReceipt;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.repository.OrderDetailRepository;
import com.ring.bookstore.repository.OrderReceiptRepository;
import com.ring.bookstore.request.OrderRequest;
import com.ring.bookstore.service.EmailService;
import com.ring.bookstore.service.OrderService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {
	
	private final OrderReceiptRepository orderRepo;
	private final OrderDetailRepository detailRepo;
	private final BookRepository bookRepo;
	private final EmailService emailService;
	
	@Autowired
	private OrderMapper orderMapper;
	
	//Đặt sách
	@Transactional
	public OrderReceipt checkout(OrderRequest request, Account user) {
		
		//Xử lý data từ request
		String fullName = request.getFirstName() + " " + request.getLastName();
		double total = 0.0; //Tổng tiền
		
		//Check giỏ hàng
		if (request.getCart() != null && request.getCart().size() == 0) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Empty cart!");
		
		//Tạo Order
		var orderReceipt = OrderReceipt.builder()
				.fullName(fullName)
				.email(user.getEmail())
				.phone(request.getPhone())
				.oAddress(request.getAddress())
				.oMessage(request.getMessage())
				.oDate(LocalDateTime.now())
				.user(user)
				.build();
		
		OrderReceipt savedOrder = orderRepo.save(orderReceipt); //Save
		
		//Tạo OrderDetail cho từng SP
		for (CartItem i : request.getCart()) {
			//Kiểm tra sản phẩm có tồn tại trong database
			Book book = bookRepo.findById(i.getId())
			            .orElseThrow(()-> new ResourceNotFoundException("Product does not exists!"));
			total += (i.getQuantity() * book.getPrice());
			
			var orderDetail = OrderDetail.builder()
					.amount(i.getQuantity())
					.price(i.getPrice())
					.book(book)
					.order(savedOrder)
					.build();
			
			detailRepo.save(orderDetail);
		}
		
		savedOrder.setTotal(total * 1.1 + 10000l);
		
		//Gửi mail
        String subject = "Welcome to HRMS Production! ";
        String content = "<h1 style=\"color:white\"><p style=\"color:#057063\">HRMS</p>&nbsp;Chào mừng</h1>\n"
                + "<br><h3 style=\"color:white\">Tài khoản HRMS Production của đã được tạo thành công!</h3>\n \n"
                + "<br><br><p>Tên tài khoản: <b></b></p>\n"
                + "<p>Nhân viên: <b></b></p>";

        emailService.sendHtmlMessage(user.getEmail(), subject, content);
		
		return orderRepo.save(savedOrder);
	}

	@Override
	public Page<OrderDTO> getAllOrders(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending()
					: Sort.by(sortBy).descending());
		
		Page<OrderReceipt> ordersList = null;
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Có role ADMIN hoặc là người bán sách
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
        	ordersList = orderRepo.findAll(pageable);
        } else {
        	ordersList = orderRepo.findAllBySeller(user.getId(), pageable);
        }
		
        List<OrderDTO> ordersDTO = ordersList.stream().map(orderMapper::apply).collect(Collectors.toList());
        return new PageImpl<OrderDTO>(ordersDTO, pageable, ordersList.getTotalElements());
	}

	@Override
	public Page<OrderDTO> getOrdersByBookId(Integer id, Integer pageNo, Integer pageSize, String sortBy,
			String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending()
				: Sort.by(sortBy).descending());
	
		Page<OrderReceipt> ordersList = orderRepo.findAllByBookId(id, pageable);
	    List<OrderDTO> ordersDTO = ordersList.stream().map(orderMapper::apply).collect(Collectors.toList());
	    return new PageImpl<OrderDTO>(ordersDTO, pageable, ordersList.getTotalElements());
	}

	@Override
	public Page<OrderDTO> getOrdersByUser(Account user, Integer pageNo, Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		Page<OrderReceipt> ordersList = orderRepo.findAllByUser_Id(user.getId(), pageable);
	    List<OrderDTO> ordersDTO = ordersList.stream().map(orderMapper::apply).collect(Collectors.toList());
	    return new PageImpl<OrderDTO>(ordersDTO, pageable, ordersList.getTotalElements());
	}

	@Override
	public OrderDTO getOrderById(Integer id) {
		OrderReceipt order = orderRepo.findById(id).orElseThrow(() -> 
		new ResourceNotFoundException("Order does not exists!"));
		OrderDTO orderDTO = orderMapper.apply(order);
		return orderDTO;
	}
}
