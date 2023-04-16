package com.ring.bookstore.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.service.BookService;

@Service
public class BookServiceImpl implements BookService {
	
	@Autowired
	private BookRepository bookRepository;
	
	//Thêm sách
	public Book saveBook(Book Book) {
		return bookRepository.save(Book);
	}
	
	//Lấy tất cả sách
	public List<Book> getAllBooks() {
		return bookRepository.findAll();
	}
	
	//Lấy sách theo trang
    public Page<Book> getBooksPaging(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        List<Book> booksList = bookRepository.findAll();
        Page<Book> booksPage = toPage(booksList, pageable);
        return booksPage;
    }

	//Lấy sách theo id
	public Book getBookById(long id) {
		return bookRepository.findById(id).orElseThrow(() -> 
			new ResourceNotFoundException("Book", "Id", id));
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
	private Page<Book> toPage(List<Book> list, Pageable pageable){
        if(pageable.getOffset() >= list.size()){
            return Page.empty();
        }
        int startIndex = (int) pageable.getOffset();
        int endIndex = ((pageable.getOffset() + pageable.getPageSize()) > list.size())
                ? list.size()
                : (int) (pageable.getOffset() + pageable.getPageSize());
        List<Book> subList = list.subList(startIndex, endIndex);
        return new PageImpl<Book>(subList, pageable, list.size());
    }

}
