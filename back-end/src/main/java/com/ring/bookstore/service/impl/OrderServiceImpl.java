package com.ring.bookstore.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.ChartDTO;
import com.ring.bookstore.dtos.mappers.ChartDataMapper;
import com.ring.bookstore.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
	private final OrderMapper orderMapper;
	private final ChartDataMapper chartMapper;
	
	//Commit order
	@Transactional
	public OrderReceipt checkout(OrderRequest request, Account user) {
		
		//Info validation
		String cartContent = ""; //For email
		double total = 0.0; //Total price
		
		//Get cart from request
		if (request.getCart() != null && request.getCart().isEmpty()) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Cart cannot be empty!");
		
		//Create new receipt
		var orderReceipt = OrderReceipt.builder()
				.fullName(request.getName())
				.email(user.getEmail())
				.phone(request.getPhone())
				.orderAddress(request.getAddress())
				.orderMessage(request.getMessage())
				.user(user)
				.build();
		
		OrderReceipt savedOrder = orderRepo.save(orderReceipt); //Save receipt to database
		
		//Create order details
		for (CartItem item : request.getCart()) {
			//Book validation
			Book book = bookRepo.findById(item.getId())
			            .orElseThrow(()-> new ResourceNotFoundException("Product not found!"));
			if (book.getAmount() < item.getQuantity()) throw new ResourceNotFoundException("Product is out of stock!");

			//Calculate
			double shippingFee = 10000.0;
			double productPrice = book.getPrice() * (BigDecimal.valueOf(1).subtract(book.getDiscount())).doubleValue();
			double totalPrice = (item.getQuantity() * productPrice) + shippingFee;
			total += totalPrice; //Add to total price
			
			//Add to email content
			cartContent += 
			  "<div style=\"display: flex; padding: 5px 15px; border: 0.5px solid lightgray;\">\r\n"
			+ "	   <div style=\"margin-left: 15px;\">\r\n"
			+ "      <h3>" + book.getTitle() + "</h3>\r\n"
			+ "      <p style=\"font-size: 14px;\">x" + item.getQuantity() + "</p>\r\n"
			+ "      <p style=\"font-size: 16px; color: green;\"><b style=\"color: black;\">Thành tiền: </b>" + totalPrice + "đ</p>\r\n"
			+ "    </div>\r\n"
			+ "</div><br><br>";
			
			//Create details
			var orderDetail = OrderDetail.builder()
					.amount(item.getQuantity())
					.price(productPrice)
					.book(book)
					.order(savedOrder)
					.status(OrderStatus.PENDING)
					.build();

			//Decrease product amount
			book.setAmount((short) (book.getAmount() - item.getQuantity()));

			bookRepo.save(book); //Save after decrement
			detailRepo.save(orderDetail); //Save details to database
		}
		
		savedOrder.setTotal(total);
		
		//Create and send email
        String subject = "RING! - BOOKSTORE: Đặt hàng thành công! "; 
        String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
                + "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
                + "Đơn hàng của bạn đã được xác nhận!\r\n"
                + "</h2>\n"
                + "<h3>Chi tiết đơn hàng:</h3>\n"
                + "<p><b>Tên người nhận: </b>" + request.getName() + "</p>\n"
                + "<p><b>SĐT người nhận: </b>" + request.getPhone() + "</p>\n"
                + "<p><b>Địa chỉ: </b>" + request.getAddress() + "</p>\n"
                + "<br><p>Lời nhắn cho shipper: <b>" + request.getMessage() + "</b></p>\n"
                + "<br><br><h3>Chi tiết sản phẩm:</h3>\n"
                + cartContent
                + "<br><br><h3>Tổng đơn giá: <b style=\"color: red\">" + total + "đ</b></h3>";
        emailService.sendHtmlMessage(user.getEmail(), subject, content); //Send
		
		return orderRepo.save(savedOrder); //Save to database
	}

	//Get all orders
	@Override
	public Page<OrderDTO> getAllOrders(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
					: Sort.by(sortBy).descending());
		
		Page<OrderReceipt> ordersList = null;
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
        	ordersList = orderRepo.findAll(pageable); //Get all if ADMIN
        } else {
        	ordersList = orderRepo.findAllBySellerId(user.getId(), pageable); //If SELLER, only get their
        }

		Page<OrderDTO> ordersDTO = ordersList.map(orderMapper::orderToOrderDTO);
		return ordersDTO;
	}

	//Get order with book's {id}
	@Override
	public Page<OrderDTO> getOrdersByBookId(Long id, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
				: Sort.by(sortBy).descending());
	
		Page<OrderReceipt> ordersList = orderRepo.findAllByBookId(id, pageable); //Fetch from database
		Page<OrderDTO> ordersDTO = ordersList.map(orderMapper::orderToOrderDTO);
		return ordersDTO;
	}

	//Get current user's orders
	@Override
	public Page<OrderDTO> getOrdersByUser(Account user, Integer pageNo, Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize); //Pagination
		Page<OrderReceipt> ordersList = orderRepo.findAllByUserId(user.getId(), pageable); //Fetch from database
		Page<OrderDTO> ordersDTO = ordersList.map(orderMapper::orderToOrderDTO);
		return ordersDTO;
	}

	//Get order by {id}
	@Override
	public OrderDTO getOrderById(Long id) {
		OrderReceipt order = orderRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
		OrderDTO orderDTO = orderMapper.orderToOrderDTO(order); //Map to DTO
		return orderDTO;
	}

	//Get monthly sales
	@Override
	public List<ChartDTO> getMonthlySale(Account user) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		List<Map<String,Object>> result;

        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
			result = orderRepo.getMonthlySale(); //Get all if ADMIN
        } else {
			result = orderRepo.getMonthlySaleBySeller(user.getId()); //If seller only get their
        }
		return result.stream().map(chartMapper::apply).collect(Collectors.toList()); //Return chart data
	}
}
