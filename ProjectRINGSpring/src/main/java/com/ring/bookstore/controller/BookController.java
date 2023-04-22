package com.ring.bookstore.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.Category;
import com.ring.bookstore.service.BookService;
import com.ring.bookstore.service.CategoryService;
import com.ring.bookstore.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class BookController {
	
	private final BookService bookService;
	private final ReviewService reviewService;
	private final CategoryService cateService;
	
	//Lấy sách theo trang
	@GetMapping("/books")
    public ResponseEntity<?> getAllBooks(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo){
        Page<BookDTO> books =  bookService.getAllBooks(pageNo, pageSize);
        return new ResponseEntity< >(books, HttpStatus.OK);
    }
	
	//Test
	@GetMapping("/books/filters")
    public ResponseEntity<?> getBooksByFilter(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
    										@RequestParam(value = "keyword", defaultValue = "") String keyword,
    										@RequestParam(value = "cateId", defaultValue = "0") Long cateId,
    										@RequestParam(value = "pubId", defaultValue = "0") Long pubId,
    										@RequestParam(value = "type", defaultValue = "") String type,
    										@RequestParam(value = "fromRange", defaultValue = "0") Double fromRange,
    										@RequestParam(value = "toRange", defaultValue = "45000") Double toRange){
        Page<BookDTO> books =  bookService.getBooksByFilter(pageNo, pageSize, keyword, cateId, pubId, type, fromRange, toRange);
        return new ResponseEntity< >(books, HttpStatus.OK);
    }
	
	//Lấy sách theo {id}
	@GetMapping("/books/{id}")
	public ResponseEntity<Book> getBookById(@PathVariable("id") long bookId){
		return new ResponseEntity<Book>(bookService.getBookById(bookId), HttpStatus.OK);
	}
	
	//Lấy Review theo sách
	@GetMapping("/books/{id}/review/{pageNo}")
	public ResponseEntity<?> getReviewByBookId(@PathVariable("id") long bookId,
											@RequestParam(value = "pSize", required = false, defaultValue = "5") Integer pageSize,
											@PathVariable("pageNo") int pageNo){
		return new ResponseEntity< >(reviewService.getReviewsByBookId(bookId, pageNo, pageSize), HttpStatus.OK);
	}
	
	//Lấy tất Danh mục
	@GetMapping("/categories")
	public ResponseEntity<?> getAllCategories(){
		System.out.println("test");
		List<Category> categories =  cateService.getAllCategories();
		return new ResponseEntity< >(categories, HttpStatus.OK);
	}
}
