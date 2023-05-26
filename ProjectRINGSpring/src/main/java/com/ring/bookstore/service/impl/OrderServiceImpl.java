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
public class OrderServiceImpl implements OrderService { //Dịch vụ Đơn hàng
	 
	private final OrderReceiptRepository orderRepo;
	private final OrderDetailRepository detailRepo;
	private final BookRepository bookRepo;
	private final EmailService emailService;
	
	@Autowired
	private OrderMapper orderMapper;
	
	//Đặt hàng
	@Transactional
	public OrderReceipt checkout(OrderRequest request, Account user) {
		
		//Xử lý dữ liệu từ request
		String fullName = request.getFirstName() + " " + request.getLastName(); //Hợp Họ và Tên
		String cartContent = ""; //Nội dung Email của giỏ hàng
		double total = 0.0; //Tổng tiền
		
		//Kiểm tra giỏ hàng từ Request, Trống >> báo lỗi
		if (request.getCart() != null && request.getCart().size() == 0) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Empty cart!"); 
		
		//Tạo Đơn hàng mới và set dữ liệu
		var orderReceipt = OrderReceipt.builder()
				.fullName(fullName)
				.email(user.getEmail())
				.phone(request.getPhone())
				.oAddress(request.getAddress())
				.oMessage(request.getMessage())
				.oDate(LocalDateTime.now())
				.user(user)
				.build();
		
		OrderReceipt savedOrder = orderRepo.save(orderReceipt); //Lưu Đơn hàng vào CSDL
		
		//Tạo Chi tiết đơn hàng cho từng Sản phẩm trong Giỏ hàng
		for (CartItem i : request.getCart()) {
			//Kiểm tra Sản phẩm (Sách) có tồn tại trong CSDL không >> Báo lỗi
			Book book = bookRepo.findById(i.getId()) 
			            .orElseThrow(()-> new ResourceNotFoundException("Product does not exists!"));
			
			double totalPrice = (i.getQuantity() * book.getPrice()); //Tính giá tiền sản phẩm (Giá X Số lượng)
			total += totalPrice; //Thêm vào tổng giá trị Giỏ hàng
			
			//Thêm sản phẩm vào nội dung Email
			cartContent += 
			  "<div style=\"display: flex; padding: 5px 15px; border: 0.5px solid lightgray;\">\r\n"
			+ "	   <div style=\"margin-left: 15px;\">\r\n"
			+ "      <h3>" + book.getTitle() + "</h3>\r\n"
			+ "      <p style=\"font-size: 14px;\">x" + i.getQuantity() + "</p>\r\n"
			+ "      <p style=\"font-size: 16px; color: green;\"><b style=\"color: black;\">Thành tiền: </b>" + totalPrice + "đ</p>\r\n"
			+ "    </div>\r\n"
			+ "</div><br><br>";
			
			//Tạo Chi tiết đơn hàng và set dữ liệu
			var orderDetail = OrderDetail.builder()
					.amount(i.getQuantity())
					.price(book.getPrice())
					.book(book)
					.order(savedOrder)
					.build();
			
			detailRepo.save(orderDetail); //Lưu Chi tiết đơn hàng vào CSDL
		}
		
		savedOrder.setTotal(total * 1.1 + 10000); //Lưu tổng giá trị đơn hàng vào Đơn hàng
		
		//Tạo và gửi Email
        String subject = "RING! - BOOKSTORE: Đặt hàng thành công! "; 
        String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
                + "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
                + "Đơn hàng của bạn đã được xác nhận!\r\n"
                + "</h2>\n"
                + "<h3>Chi tiết đơn hàng:</h3>\n"
                + "<p><b>Tên người nhận: </b>" + fullName + "</p>\n"
                + "<p><b>SĐT người nhận: </b>" + request.getPhone() + "</p>\n"
                + "<p><b>Địa chỉ: </b>" + request.getAddress() + "</p>\n"
                + "<br><p>Lời nhắn cho shipper: <b>" + request.getMessage() + "</b></p>\n"
                + "<br><br><h3>Chi tiết sản phẩm:</h3>\n"
                + cartContent
                + "<br><br><h3>Tổng đơn giá: <b style=\"color: red\">" + total * 1.1 + 10000 + "đ</b></h3>";
        emailService.sendHtmlMessage(user.getEmail(), subject, content); //Gửi
		
		return orderRepo.save(savedOrder); //Lưu Đơn hàng vào CSDL và trả về
	}

	//Lấy tất cả Đơn hàng
	@Override
	public Page<OrderDTO> getAllOrders(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
					: Sort.by(sortBy).descending());
		
		Page<OrderReceipt> ordersList = null;
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
        	ordersList = orderRepo.findAll(pageable); //Có Quyền ADMIN >> Lấy tất cả từ CSDL
        } else {
        	ordersList = orderRepo.findAllBySeller(user.getId(), pageable); //Có quyền SELLER >> Chỉ lấy Đơn hàng từ sách họ bán
        }
		
        List<OrderDTO> ordersDTO = ordersList.stream().map(orderMapper::apply).collect(Collectors.toList()); //Map sang DTO
        return new PageImpl<OrderDTO>(ordersDTO, pageable, ordersList.getTotalElements()); //Trả về sau khi phân trang và Map
	}

	//Lấy Đơn hàng theo {Id Sách}
	@Override
	public Page<OrderDTO> getOrdersByBookId(Integer id, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
				: Sort.by(sortBy).descending());
	
		Page<OrderReceipt> ordersList = orderRepo.findAllByBookId(id, pageable); //Lấy Đơn hàng từ CSDL
	    List<OrderDTO> ordersDTO = ordersList.stream().map(orderMapper::apply).collect(Collectors.toList()); //Map và phân trang
	    return new PageImpl<OrderDTO>(ordersDTO, pageable, ordersList.getTotalElements()); //Trả về
	}

	//Lấy Đơn hàng theo Người dùng hiện tại
	@Override
	public Page<OrderDTO> getOrdersByUser(Account user, Integer pageNo, Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize); //Phân trang
		Page<OrderReceipt> ordersList = orderRepo.findAllByUser_Id(user.getId(), pageable); //Lấy Đơn hàng từ CSDL
	    List<OrderDTO> ordersDTO = ordersList.stream().map(orderMapper::apply).collect(Collectors.toList()); //Map và phân trang
	    return new PageImpl<OrderDTO>(ordersDTO, pageable, ordersList.getTotalElements()); //Trả về
	}

	//Lấy đơn hàng theo {id}
	@Override
	public OrderDTO getOrderById(Integer id) {
		OrderReceipt order = orderRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order does not exists!")); //Báo lỗi nếu ko có
		OrderDTO orderDTO = orderMapper.apply(order); //Map sang DTO
		return orderDTO; //Trả về
	}

	//Lấy dữ liệu doanh thu theo tháng
	@Override
	public List<IChartResponse> getMonthlySale(Account user) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
        	return orderRepo.getMonthlySale(); //Có quyền ADMIN >> Lấy dữ liệu tất cả Đơn hàng từ CSDL
        } else {
        	return orderRepo.getMonthlySaleBySeller(user.getId()); //Có quyền SELLER >> Chỉ lấy dữ liệu Đơn hàng từ sách họ bán
        }
	}
}
