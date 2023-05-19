package com.ring.bookstore.service.impl;

import java.io.IOException;
import java.util.Arrays;
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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.BookDTO;
import com.ring.bookstore.dtos.BookDetailDTO;
import com.ring.bookstore.dtos.IBookDisplay;
import com.ring.bookstore.dtos.mappers.BookDetailMapper;
import com.ring.bookstore.dtos.mappers.BookDisplayMapper;
import com.ring.bookstore.dtos.mappers.BookMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.BookDetail;
import com.ring.bookstore.model.Category;
import com.ring.bookstore.model.Image;
import com.ring.bookstore.model.Publisher;
import com.ring.bookstore.repository.BookDetailRepository;
import com.ring.bookstore.repository.BookRepository;
import com.ring.bookstore.repository.CategoryRepository;
import com.ring.bookstore.repository.ImageRepository;
import com.ring.bookstore.repository.PublisherRepository;
import com.ring.bookstore.request.BookRequest;
import com.ring.bookstore.service.BookService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class BookServiceImpl implements BookService {
	
	private final PublisherRepository pubRepo;
	private final BookRepository bookRepo;
	private final BookDetailRepository detailRepo;
	private final CategoryRepository cateRepo;
	private final ImageRepository imageRepo;
	
	@Autowired
	private BookMapper bookMapper;
	@Autowired
	private BookDisplayMapper bookDisplayMapper;
	@Autowired
	private BookDetailMapper bookDetailMapper;
	
	//Lấy sách theo trang
    public Page<BookDTO> getAllBooks(Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Book> booksList = bookRepo.findAll(pageable);
        List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList());
        return new PageImpl<BookDTO>(bookDtos, pageable, booksList.getTotalElements());
    }
    
    //Lấy sách random
	public List<BookDTO> getRandomBooks(Integer amount) {
	    List<Book> booksList = bookRepo.findRandomBooks(amount);
	    List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList());
        return bookDtos;
	}
    
	//Lấy sách theo bộ lọc
    public Page<BookDTO> getBooksByFilter(Integer pageNo, Integer pageSize, String sortBy, String sortDir,
    		String keyword, Integer cateId, List<Integer> pubId, String seller, String type, Double fromRange, Double toRange) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending()
                											: Sort.by(sortBy).descending());
        
        //To String
        String cateIdString = "";
        String[] pubListString = {""};
        
        if (cateId != 0) cateIdString = String.valueOf(cateId);  
        if (pubId.size() != 0) {
        	List<Integer> pubList = pubRepo.findAllIds();
            pubList.removeAll(pubId);
        	pubListString = Arrays.toString(pubList.toArray()).split("[\\[\\]]")[1].split(", "); 
        }
        
        //Get
        Page<IBookDisplay> booksList = bookRepo.findBooksWithFilter(keyword
										        		, cateIdString
										        		, pubListString
										        		, seller
										        		, type
										        		, fromRange
										        		, toRange
										        		, pageable);
        List<BookDTO> bookDtos = booksList.stream().map(bookDisplayMapper::apply).collect(Collectors.toList());
        return new PageImpl<BookDTO>(bookDtos, pageable, booksList.getTotalElements());
    }
    
    //Lấy sách theo id
  	public Book getBookById(Integer id) {
  		Book book= bookRepo.findById(id).orElseThrow(() -> 
  			new ResourceNotFoundException("Product does not exists!"));
  		return book;
  	}

	//Lấy sách hiển thị theo id
	public BookDetailDTO getBookDetailById(Integer id) {
		Book book= bookRepo.findById(id).orElseThrow(() -> 
			new ResourceNotFoundException("Product does not exists!"));
		BookDetailDTO bookDetailDTO = bookDetailMapper.apply(book);
		return bookDetailDTO;
	}
	
	//Thêm sách
	@Transactional
	public Book addBook(BookRequest request, MultipartFile file, Account seller) throws IOException {
		//Kiểm tra ảnh
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		Image image = imageRepo.findByName(fileName).orElse(
			Image.builder()
    		.name(fileName)
    		.type(file.getContentType())
    		.image(file.getBytes())
			.build()
		);
	    		
	    //Kiểm tra thông tin
		Category cate = cateRepo.findById(request.getCateId()).orElseThrow(()-> new ResourceNotFoundException("Category not found"));
		Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(()-> new ResourceNotFoundException("Publisher not found"));
		
		Image savedImage = imageRepo.save(image); //Save ảnh
		
		//Thêm sách vào DTB
        var book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .images(savedImage)
                .price(request.getPrice())
                .publisher(pub)
                .cate(cate)
                .user(seller)
                .author(request.getAuthor())
                .amount(request.getAmount())
                .type(request.getType())
                .build();
        Book addedBook = bookRepo.save(book);

        //Thêm thông tin sách vào DTB
        var bookDetail = BookDetail.builder()
        		.book(addedBook)
        		.bWeight(request.getWeight())
        		.size(request.getSize())
        		.pages(request.getPages())
        		.bLanguage(request.getLanguage())
        		.bDate(request.getDate())
                .build();
        BookDetail addedDetail = detailRepo.save(bookDetail);

        //Set chi tiết vào Sách để trả về api
        addedBook.setBookDetail(addedDetail);
        return addedBook;
	}

	//Sửa sách
	@Transactional
	public Book updateBook(BookRequest request, MultipartFile file, Integer id, Account seller) throws IOException {
		//Kiểm tra ảnh
		Image newImage = null;
		
		if (file != null) { //Tạo ảnh mới nếu có file ảnh mới
			String fileName = StringUtils.cleanPath(file.getOriginalFilename());
			Image image = imageRepo.findByName(fileName).orElse(
				Image.builder()
	    		.name(fileName)
	    		.type(file.getContentType())
	    		.image(file.getBytes())
				.build()
			);
			newImage = image;
		}
		
	    //Kiểm tra thông tin
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found"));
		Category cate = cateRepo.findById(request.getCateId()).orElseThrow(()-> new ResourceNotFoundException("Category not found"));
		Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(()-> new ResourceNotFoundException("Publisher not found"));
		
		//Check seller
		if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");
		
		//Update Book
		BookDetail currDetail = book.getBookDetail();
		currDetail.setBWeight(request.getWeight());
		currDetail.setSize(request.getSize());
		currDetail.setPages(request.getPages());
		currDetail.setBLanguage(request.getLanguage());
		currDetail.setBDate(request.getDate());
        detailRepo.save(currDetail);
		
		book.setTitle(request.getTitle());
		book.setDescription(request.getDescription());
		book.setPrice(request.getPrice());
		book.setPublisher(pub);
		book.setCate(cate);
		book.setAuthor(request.getAuthor());
		book.setAmount(request.getAmount());
		book.setType(request.getType());
		if (file != null) {
			Image savedImage = imageRepo.save(newImage);
			book.setImages(savedImage); //Nếu có ảnh mới >> set
		}
		
		Book savedBook = bookRepo.save(book);
        return savedBook;
	}

	//Xoá sách
	@Transactional
	public Book deleteBook(Integer id, Account seller) {
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found"));
		//Check seller
		if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

		bookRepo.deleteById(id);
		return book;
	}
	
	protected boolean isSellerValid(Book book, Account seller){
        boolean result = false;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Có role ADMIN hoặc là người bán cuốn Sách
        if (book.getUser().getId().equals(seller.getId()) 
        		|| (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())))) {
            result = true;
        }
        return result;
    }

}
