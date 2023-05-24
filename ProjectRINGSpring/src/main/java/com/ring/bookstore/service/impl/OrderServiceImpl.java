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
import com.ring.bookstore.response.IChartResponse;
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
		String cartContent = "";
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
			double totalPrice = (i.getQuantity() * book.getPrice());
			total += totalPrice;
			
			cartContent += 
			"<p>Tên sản phẩm: <b>" + book.getTitle() + "</b></p>\n"
    		+ "<p>Số lượng: <b>" + i.getQuantity() + "</b></p>\n"
    		+ "<p>Thành tiền: <b>" + totalPrice + "đ </b></p>\n"
    		+ "<br><br>\n";
			
			var orderDetail = OrderDetail.builder()
					.amount(i.getQuantity())
					.price(book.getPrice())
					.book(book)
					.order(savedOrder)
					.build();
			
			detailRepo.save(orderDetail);
		}
		
		savedOrder.setTotal(total * 1.1 + 10000l);
		
		//Gửi mail
        String subject = "RING! - BOOKSTORE: Đặt hàng thành công! ";
        String content = "<h1 style=\"color:black\"><p style=\"color:#63e399\">RING!</p>&nbsp;- BOOKSTORE</h1>\n"
                + "<h2>Đơn hàng của bạn đã được xác nhận!</h2>\n"
                + "<h3>Chi tiết đơn hàng:</h3>\n"
                + "<p>Tên người nhận: <b>" + fullName + "</b></p>\n"
                + "<p>SĐT người nhận: <b>" + request.getPhone()+ "</b></p>\n"
                + "<p>Địa chỉ: <b>" + request.getAddress()  + "</b></p>\n"
                + "<br><p>Lời nhắn cho shipper: <b>" + request.getMessage() + "</b></p>\n"
                + "<br><br><h3>Chi tiết sản phẩm:</h3>\n"
                + cartContent;
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

	@Override
	public List<IChartResponse> getMonthlySale(Account user) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
        //Có role ADMIN hoặc là người bán sách
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
        	return orderRepo.getMonthlySale();
        } else {
        	return orderRepo.getMonthlySaleBySeller(user.getId());
        }
	}
}
