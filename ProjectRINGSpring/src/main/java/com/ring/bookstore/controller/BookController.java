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

import com.ring.bookstore.model.Book;
import com.ring.bookstore.service.BookService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/books")
public class BookController {
	
	private BookService bookService;
	
	public BookController(BookService bookService) {
		super();
		this.bookService = bookService;
	}

	//Lấy tất cả sách
	@GetMapping()
	public List<Book> getAllBooks(){
		return bookService.getAllBooks();
	}
	
	//Lấy sách theo trang
	@GetMapping("/pages/{pageNo}")
    public Page<Book> getBooksPaging(@RequestParam(value = "pSize", required = false, defaultValue = "15") Integer pageSize,
    		@PathVariable("pageNo") int pageNo){
        return bookService.getBooksPaging(pageNo, pageSize);
    }
	
	//Lấy sách theo {id}
	@GetMapping("{id}")
	public ResponseEntity<Book> getEmployeeById(@PathVariable("id") long bookId){
		return new ResponseEntity<Book>(bookService.getBookById(bookId), HttpStatus.OK);
	}
}
