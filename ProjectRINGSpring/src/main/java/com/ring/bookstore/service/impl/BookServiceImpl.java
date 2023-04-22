package com.ring.bookstore.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.dtos.mappers.BookMapper;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.service.BookService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class BookServiceImpl implements BookService {
	
	private final BookRepository bookRepo;
	
	@Autowired
	private BookMapper bookMapper;
	
	//Thêm sách
	public Book saveBook(Book Book) {
		return bookRepo.save(Book);
	}
	
	//Lấy tất cả sách
	public List<BookDTO> getAllBooks() {
		List<Book> booksList = bookRepo.findAll();
		List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList());
		return bookDtos;
	}
	
	//Lấy sách theo trang
    public Page<BookDTO> getAllBooks(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        List<Book> booksList = bookRepo.findAll();
        List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList());
        Page<BookDTO> booksPage = toPage(bookDtos, pageable);
        return booksPage;
    }
    
    public Page<BookDTO> getBooksByFilter(int pageNo, int pageSize, 
    		String keyword, long cateId, long pubId, String type, Double fromRange, Double toRange) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        
        //To String
        String cateIdString = "";
        String pubIdString = "";
        
        if (cateId != 0) cateIdString = String.valueOf(cateId);  
        if (pubId != 0) pubIdString = String.valueOf(pubId);
        
        //Get
        List<Book> booksList = bookRepo.findBooksWithFilter("%" + keyword + "%"
										        		, "%" + cateIdString + "%"
										        		, "%" + pubIdString + "%"
										        		, "%" + type + "%"
										        		, fromRange
										        		, toRange);
        List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList());
        Page<BookDTO> booksPage = toPage(bookDtos, pageable);
        return booksPage;
    }

	//Lấy sách theo id
	public Book getBookById(long id) {
		return bookRepo.findById(id).orElseThrow(() -> 
			new ResourceNotFoundException("Product does not exists!"));
	}

	//Sửa sách
	public Book updateBook(Book Book, long id) {
		return null;
	}

	@Override
	public void deleteBook(long id) {
		// TODO Auto-generated method stub
		
	}
	
	//Trang
	private Page<BookDTO> toPage(List<BookDTO> list, Pageable pageable){
        if(pageable.getOffset() >= list.size()){
            return Page.empty();
        }
        int startIndex = (int) pageable.getOffset();
        int endIndex = ((pageable.getOffset() + pageable.getPageSize()) > list.size())
                ? list.size()
                : (int) (pageable.getOffset() + pageable.getPageSize());
        List<BookDTO> subList = list.subList(startIndex, endIndex);
        return new PageImpl<BookDTO>(subList, pageable, list.size());
    }

}
