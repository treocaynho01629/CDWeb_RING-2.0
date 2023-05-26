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
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ReviewDTO;
import com.ring.bookstore.dtos.mappers.ReviewMapper;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.Review;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.repository.OrderReceiptRepository;
import com.ring.bookstore.repository.ReviewRepository;
import com.ring.bookstore.request.ReviewRequest;
import com.ring.bookstore.service.ReviewService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReviewServiceImpl implements ReviewService { //Dịch vụ Đánh giá
	
	private final ReviewRepository reviewRepo;
	private final BookRepository bookRepo;
	private final OrderReceiptRepository orderRepo;
	
	@Autowired
	private ReviewMapper reviewMapper;
	
	//Đánh giá Sản phẩm
	public Review review(Integer id, ReviewRequest request, Account user) {
		
		//Kiểm tra Sách ko tồn tại >> báo lỗi
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found")); 
		//Kiểm tra người dùng đã mua sách chưa >> báo lỗi
		if (!orderRepo.existsByUserBuyBook(id, user.getUsername())) throw new HttpResponseException(HttpStatus.NO_CONTENT, "Hãy mua sản phẩm để có thể đánh giá!");
		//Kiểm tra người dùng đã đánh giá Sách này chưa >> báo lỗi
		if (reviewRepo.existsByBook_IdAndUser_Id(id, user.getId())) throw new HttpResponseException(HttpStatus.ALREADY_REPORTED, "Bạn đã đánh giá sản phẩm rồi!");
		
		//Tạo Đánh giá và set thông tin
        var review = Review.builder()
                .book(book)
                .rating(request.getRating())
                .rContent(request.getContent())
                .rDate(LocalDateTime.now())
                .user(user)
                .build();
        
        Review addedReview = reviewRepo.save(review); //Lưu Đánh giá vào CSDL
        return addedReview; //Trả về
	}
	
	//Lấy tất cả Đánh giá
	public Page<ReviewDTO> getAllReviews(Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAll(pageable); //Lấy Đánh giá
		List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList()); //Map sang DTO
        return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements()); //Trả Đánh giá đã phân trang và Map
	}

	//Lấy Đánh giá theo {Id Sách}
	public Page<ReviewDTO> getReviewsByBookId(Integer id, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAllByBook_Id(id, pageable); //Lấy Đánh giá
        List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList()); //Map sang DTO
        return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements()); //Trả Đánh giá đã phân trang và Map
	}
	
	//Lấy Đánh giá theo {Id Người dùng}
	public Page<ReviewDTO> getReviewsByUser(Integer userId, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAllByUser_Id(userId, pageable); //Lấy Đánh giá
	    List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList()); //Map sang DTO
	    return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements()); //Trả Đánh giá đã phân trang và Map
	}

	//Lấy Đánh giá theo Người dùng hiện tại
	public Page<ReviewDTO> getReviewsByUser(Account user, Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
				: Sort.by(sortBy).descending());
		Page<Review> reviewsList = reviewRepo.findAllByUser_Id(user.getId(), pageable); //Lấy Đánh giá
	    List<ReviewDTO> reviewDtos = reviewsList.stream().map(reviewMapper::apply).collect(Collectors.toList()); //Map sang DTO
	    return new PageImpl<ReviewDTO>(reviewDtos, pageable, reviewsList.getTotalElements()); //Trả Đánh giá đã phân trang và Map
	}
	
	//Xoá Đánh giá theo {id} (ADMIN)
	public Review deleteReview(Integer id) {
		Review review = reviewRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Review does not exists!")); //Nếu không tồn tại >> Bão lỗi
		reviewRepo.deleteById(id); //Xoá khỏi CSDL
		return review;
	}
	
	//Xoá nhiều Đánh giá (ADMIN)
	@Transactional
	public void deleteReviews(List<Integer> ids) {
		//Duyệt từng Đánh giá
		for (Integer id : ids) {
			reviewRepo.findById(id)
					.orElseThrow(() -> new ResourceNotFoundException("Review does not exists!")); //Nếu không tồn tại >> Bão lỗi
			reviewRepo.deleteById(id); //Xoá khỏi CSDL
		}
	}
	
	//Xoá tất cả Đánh giá (ADMIN)
	@Transactional
	public void deleteAllReviews() {
		reviewRepo.deleteAll();
	}
}
