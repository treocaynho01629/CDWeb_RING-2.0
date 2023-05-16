package com.ring.bookstore.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.request.BookRequest;
import com.ring.bookstore.service.BookService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Validated
public class BookController {
	
	private final BookService bookService;
	private final AccountRepository accRepo;
	
	//Lấy sách theo trang
	@GetMapping()
    public ResponseEntity<?> getAllBooks(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo){
        Page<BookDTO> books =  bookService.getAllBooks(pageNo, pageSize);
        return new ResponseEntity< >(books, HttpStatus.OK);
    }
	
	//Lấy sách random
	@GetMapping("/random")
    public ResponseEntity<?> getRandomBooks(@RequestParam(value = "amount", defaultValue = "5") Integer amount){
        List<BookDTO> books =  bookService.getRandomBooks(amount);
        return new ResponseEntity< >(books, HttpStatus.OK);
    }
	
	//Filters
	@GetMapping("/filters")
    public ResponseEntity<?> getBooksByFilter(@RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
    										@RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
    										@RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
    										@RequestParam(value = "sortDir", defaultValue = "asc") String sortDir,
    										@RequestParam(value = "keyword", defaultValue = "") String keyword,
    										@RequestParam(value = "cateId", defaultValue = "0") Integer cateId,
    										@RequestParam(value = "pubId", defaultValue = "") List<Integer> pubId,
    										@RequestParam(value = "seller", defaultValue = "") String seller,
    										@RequestParam(value = "type", defaultValue = "") String type,
    										@RequestParam(value = "fromRange", defaultValue = "1000") Double fromRange,
    										@RequestParam(value = "toRange", defaultValue = "100000000") Double toRange){
        Page<BookDTO> books =  bookService.getBooksByFilter(pageNo, pageSize, sortBy, sortDir, keyword, cateId, pubId, seller, type, fromRange, toRange);
        return new ResponseEntity< >(books, HttpStatus.OK);
    }
	
	//Lấy sách hiển thị theo {id}
	@GetMapping("/{id}")
	public ResponseEntity<?> getBookDetailById(@PathVariable("id") Integer bookId) {
		return new ResponseEntity< >(bookService.getBookDetailById(bookId), HttpStatus.OK);
	}
	
	@PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> addBook(@Valid @RequestPart("request") BookRequest request,
									@RequestPart("image") MultipartFile file,
		 							@CurrentAccount Account currUser) {
		try {
			Book addedBook = bookService.addBook(request, file, currUser);
			return new ResponseEntity< >(addedBook, HttpStatus.CREATED);
		} catch (IOException e) {
			String message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
		}
    }
	
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<?> updateBook(@Valid @RequestPart("request") BookRequest request, 
    									@RequestPart(name="image", required=false) MultipartFile file,
    									@PathVariable("id") Integer id,
    									@CurrentAccount Account currUser) {
    	
    	try {
    		Book savedBook = bookService.updateBook(request, file, id, currUser);
			return new ResponseEntity< >(savedBook, HttpStatus.CREATED);
		} catch (IOException e) {
			String message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
		}
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<Book> removeBook(@PathVariable("id") int id,
										@CurrentAccount Account currUser) {
        Book deletedBook = bookService.deleteBook(id, currUser);
        return new ResponseEntity<>(deletedBook, HttpStatus.OK);
    }
	
	//Test
	@GetMapping("/test/{id}")
    public ResponseEntity<?> getTest(@PathVariable("id") long bookId){
        Account test =  accRepo.findByUserName("chuotcon1").orElse(null);
        return new ResponseEntity< >(test, HttpStatus.OK);
    }
}
