package com.ring.bookstore.service.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.service.ImageService;
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

	@Autowired
	private ImageService imageService;
	@Autowired
	private BookMapper bookMapper;
	@Autowired
	private BookDisplayMapper bookDisplayMapper;
	@Autowired
	private BookDetailMapper bookDetailMapper;
	
	//Get all books
    public Page<BookDTO> getAllBooks(Integer pageNo, Integer pageSize) {
    	//Pagination
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Book> booksList = bookRepo.findAll(pageable);
        //Map to DTO
        List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList());
        return new PageImpl<BookDTO>(bookDtos, pageable, booksList.getTotalElements()); //Return paginated books
    }
    
    //Get random books
	public List<BookDTO> getRandomBooks(Integer amount) {
	    List<Book> booksList = bookRepo.findRandomBooks(amount);
	    List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList()); //Return books
        return bookDtos;
	}
    
	//Get books by filtering
    public Page<BookDTO> getBooksByFilter(Integer pageNo, Integer pageSize, String sortBy, String sortDir,
    		String keyword, Integer cateId, List<Integer> pubId, String seller, String type, Double fromRange, Double toRange) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                											: Sort.by(sortBy).descending());
        
        //Convert these to string
        String cateIdString = "";
        String[] pubListString = {""};
        
        if (cateId != 0) cateIdString = String.valueOf(cateId);  
        if (pubId.size() != 0) {
        	List<Integer> pubList = pubRepo.findAllIds();
            pubList.removeAll(pubId);
        	pubListString = Arrays.toString(pubList.toArray()).split("[\\[\\]]")[1].split(", "); 
        }
        
        //Fetch from database
        Page<IBookDisplay> booksList = bookRepo.findBooksWithFilter(keyword
										        		, cateIdString
										        		, pubListString
										        		, seller
										        		, type
										        		, fromRange
										        		, toRange
										        		, pageable);
        List<BookDTO> bookDtos = booksList.stream().map(bookDisplayMapper::apply).collect(Collectors.toList()); //Map to DTO
        return new PageImpl<BookDTO>(bookDtos, pageable, booksList.getTotalElements()); //Return paginated books
    }
    
    //Get book by {id}
  	public Book getBookById(Integer id) {
  		Book book= bookRepo.findById(id).orElseThrow(() -> 
  			new ResourceNotFoundException("Product does not exists!"));
  		return book;
  	}

	//Get display book info by {id}
	public BookDetailDTO getBookDetailById(Integer id) {
		Book book= bookRepo.findById(id).orElseThrow(() -> 
			new ResourceNotFoundException("Product does not exists!"));
		BookDetailDTO bookDetailDTO = bookDetailMapper.apply(book); //Map to DTO
		return bookDetailDTO;
	}
	
	//Add book (SELLER)
	@Transactional
	public Book addBook(BookRequest request, MultipartFile file, Account seller) throws IOException, ImageResizerException {
		//Category & publisher validation
		Category cate = cateRepo.findById(request.getCateId()).orElseThrow(()-> new ResourceNotFoundException("Category not found"));
		Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(()-> new ResourceNotFoundException("Publisher not found"));

		//Image upload
		Image savedImage = imageService.upload(file);

		//Create new book
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
        Book addedBook = bookRepo.save(book); //Save to database

        //Create book details
        var bookDetail = BookDetail.builder()
        		.book(addedBook)
        		.bWeight(request.getWeight())
        		.size(request.getSize())
        		.pages(request.getPages())
        		.bLanguage(request.getLanguage())
        		.bDate(request.getDate())
                .build();
        BookDetail addedDetail = detailRepo.save(bookDetail); //Save details to databasae

        //Return added book
        addedBook.setBookDetail(addedDetail);
        return addedBook;
	}

	//Update book (SELLER)
	@Transactional
	public Book updateBook(BookRequest request, MultipartFile file, Integer id, Account seller) throws IOException, ImageResizerException {
	    //Check book exists & category, publisher validation
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found"));
		Category cate = cateRepo.findById(request.getCateId()).orElseThrow(()-> new ResourceNotFoundException("Category not found"));
		Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(()-> new ResourceNotFoundException("Publisher not found"));

		//Check if correct seller or admin
		if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

		//Image upload/replace
		if (file != null) { //Contain new image >> upload/replace
			imageService.deleteImage(book.getImages().getId()); //Delete old image
			Image savedImage = imageService.upload(file); //Upload new image
			book.setImages(savedImage); //Save to database
		}

		//Set new details info
		BookDetail currDetail = book.getBookDetail();
		currDetail.setBWeight(request.getWeight());
		currDetail.setSize(request.getSize());
		currDetail.setPages(request.getPages());
		currDetail.setBLanguage(request.getLanguage());
		currDetail.setBDate(request.getDate());
        detailRepo.save(currDetail); //Save new details to database
		
        //Set new info
		book.setTitle(request.getTitle());
		book.setDescription(request.getDescription());
		book.setPrice(request.getPrice());
		book.setPublisher(pub);
		book.setCate(cate);
		book.setAuthor(request.getAuthor());
		book.setAmount(request.getAmount());
		book.setType(request.getType());
		
		//Return updated book
		Book savedBook = bookRepo.save(book);
        return savedBook;
	}

	//Delete book (SELLER)
	@Transactional
	public Book deleteBook(Integer id, Account seller) {
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found"));
		//Check if correct seller or admin
		if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

		bookRepo.deleteById(id); //Delete from database
		return book;
	}
	
	//Delete multiples books (SELLER)
	@Transactional
	public void deleteBooks(List<Integer> ids, Account seller) {
		//Loop and delete
		for (Integer id : ids) {
			Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found"));
			//Check if correct seller or admin
			if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");
			bookRepo.deleteById(id); //Delete from database
		}
	}
	
	//Delete all books (SELLER)
	@Transactional
	public void deleteAllBooks(Account seller) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
			bookRepo.deleteAll();
		} else {
			bookRepo.deleteByUser_Id(seller.getId());
		}
	}
	
	//Check valid role function
	protected boolean isSellerValid(Book book, Account seller){
        boolean result = false;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current user
        //Check if is admin or valid seller id
        if (book.getUser().getId().equals(seller.getId()) 
        		|| (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())))) {
            result = true;
        }
        return result;
    }

}
