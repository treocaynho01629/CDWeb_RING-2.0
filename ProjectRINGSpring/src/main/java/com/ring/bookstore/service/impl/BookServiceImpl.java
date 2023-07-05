package com.ring.bookstore.service.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.ring.bookstore.utils.ImageUtils;
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
	
	//Lấy tất cả Sách
    public Page<BookDTO> getAllBooks(Integer pageNo, Integer pageSize) {
    	//Tạo phân trang
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Book> booksList = bookRepo.findAll(pageable);
        //Map dữ liệu sang DTO
        List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList());
        return new PageImpl<BookDTO>(bookDtos, pageable, booksList.getTotalElements()); //Trả dữ liệu đã phần trang và Map
    }
    
    //Lấy Sách ngẫu nhiên
	public List<BookDTO> getRandomBooks(Integer amount) {
	    List<Book> booksList = bookRepo.findRandomBooks(amount);
	    List<BookDTO> bookDtos = booksList.stream().map(bookMapper::apply).collect(Collectors.toList()); //Trả dữ liệu đã Map
        return bookDtos;
	}
    
	//Lấy Sách theo bộ lọc
    public Page<BookDTO> getBooksByFilter(Integer pageNo, Integer pageSize, String sortBy, String sortDir,
    		String keyword, Integer cateId, List<Integer> pubId, String seller, String type, Double fromRange, Double toRange) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
                											: Sort.by(sortBy).descending());
        
        //Chuyển bộ lọc sang String
        String cateIdString = "";
        String[] pubListString = {""};
        
        if (cateId != 0) cateIdString = String.valueOf(cateId);  
        if (pubId.size() != 0) {
        	List<Integer> pubList = pubRepo.findAllIds();
            pubList.removeAll(pubId);
        	pubListString = Arrays.toString(pubList.toArray()).split("[\\[\\]]")[1].split(", "); 
        }
        
        //Lấy Sách từ CSDL
        Page<IBookDisplay> booksList = bookRepo.findBooksWithFilter(keyword
										        		, cateIdString
										        		, pubListString
										        		, seller
										        		, type
										        		, fromRange
										        		, toRange
										        		, pageable);
        List<BookDTO> bookDtos = booksList.stream().map(bookDisplayMapper::apply).collect(Collectors.toList()); //Map dữ liệu sang DTO
        return new PageImpl<BookDTO>(bookDtos, pageable, booksList.getTotalElements()); //Trả dữ liệu đã phần trang và Map
    }
    
    //Lấy Sách theo {id}
  	public Book getBookById(Integer id) {
  		Book book= bookRepo.findById(id).orElseThrow(() -> 
  			new ResourceNotFoundException("Product does not exists!")); //Báo lỗi khi ko có
  		return book;
  	}

	//Lấy Sách hiển thị theo {id}
	public BookDetailDTO getBookDetailById(Integer id) {
		Book book= bookRepo.findById(id).orElseThrow(() -> 
			new ResourceNotFoundException("Product does not exists!")); //Báo lỗi khi không có
		BookDetailDTO bookDetailDTO = bookDetailMapper.apply(book); //Map sang DTO
		return bookDetailDTO; //Trả về
	}
	
	//Thêm Sách mới (SELLER)
	@Transactional
	public Book addBook(BookRequest request, MultipartFile file, Account seller) throws IOException {
		//Kiểm tra ảnh
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		Image image = imageRepo.findByName(fileName).orElse( //Lấy ảnh cũ nếu tồn tại || Tạo ảnh mới nếu chưa tồn tại
			Image.builder()
    		.name(fileName)
    		.type(file.getContentType())
    		.image(ImageUtils.compressImage(file.getBytes()))
			.build()
		);
	    		
		//Kiểm tra Danh mục và NXB có tồn tại
		Category cate = cateRepo.findById(request.getCateId()).orElseThrow(()-> new ResourceNotFoundException("Category not found"));
		Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(()-> new ResourceNotFoundException("Publisher not found"));
		
		Image savedImage = imageRepo.save(image); //Lưu ảnh vào CSDL
		
		//Tạo Sách mới và set thông tin
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
        Book addedBook = bookRepo.save(book); //Lưu Sách vào CSDL

        //Tạo Chi tiết sách và set thông tin
        var bookDetail = BookDetail.builder()
        		.book(addedBook)
        		.bWeight(request.getWeight())
        		.size(request.getSize())
        		.pages(request.getPages())
        		.bLanguage(request.getLanguage())
        		.bDate(request.getDate())
                .build();
        BookDetail addedDetail = detailRepo.save(bookDetail); //Lưu Chi tiết sách vào CSDL

        //Set chi tiết vào Sách và trả về Sách đã thêm
        addedBook.setBookDetail(addedDetail);
        return addedBook;
	}

	//Sửa Sách (SELLER)
	@Transactional
	public Book updateBook(BookRequest request, MultipartFile file, Integer id, Account seller) throws IOException {
		//Kiểm tra ảnh
		Image newImage = null;
		if (file != null) { //Tạo Ảnh mới nếu có file Ảnh mới
			String fileName = StringUtils.cleanPath(file.getOriginalFilename());
			Image image = imageRepo.findByName(fileName).orElse(
				Image.builder()
	    		.name(fileName)
	    		.type(file.getContentType())
	    		.image(ImageUtils.compressImage(file.getBytes()))
				.build()
			);
			newImage = image;
		}
		
	    //Kiểm tra thông tin Sách, Danh mục, NXB có tồn tại?
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found"));
		Category cate = cateRepo.findById(request.getCateId()).orElseThrow(()-> new ResourceNotFoundException("Category not found"));
		Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(()-> new ResourceNotFoundException("Publisher not found"));
		
		//Kiểm trả Nhân viên hợp lệ (Là Admin hoặc đúng sách Người dùng bán)
		if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");
		
		//Set thông tin mới cho Chi tiết sách
		BookDetail currDetail = book.getBookDetail();
		currDetail.setBWeight(request.getWeight());
		currDetail.setSize(request.getSize());
		currDetail.setPages(request.getPages());
		currDetail.setBLanguage(request.getLanguage());
		currDetail.setBDate(request.getDate());
        detailRepo.save(currDetail); //Lưu Chi tiết sách vào CSDL
		
        //Set thông tin mới cho Sách
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
			book.setImages(savedImage); //Nếu có ảnh mới >> set ảnh mới
		}
		
		//Lưu Sách vào CSDL và trả về
		Book savedBook = bookRepo.save(book);
        return savedBook;
	}

	//Xoá Sách (SELLER)
	@Transactional
	public Book deleteBook(Integer id, Account seller) {
		Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found")); //Kiểm tra sách tồn tại?
		//Kiểm trả Nhân viên hợp lệ (Là Admin hoặc đúng sách Người dùng bán)
		if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

		bookRepo.deleteById(id); //Xoá sách khỏi CSDL
		return book;
	}
	
	//Xoá nhiều sách (SELLER)
	@Transactional
	public void deleteBooks(List<Integer> ids, Account seller) {
		//Duyệt từng cuốn sách
		for (Integer id : ids) {
			Book book = bookRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Book not found")); //Kiểm tra sách tồn tại?
			//Kiểm trả Nhân viên hợp lệ (Là Admin hoặc đúng sách Người dùng bán)
			if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");
			bookRepo.deleteById(id); //Xoá sách khỏi CSDL
		}
	}
	
	//Xoá tất cả sách (SELLER)
	@Transactional
	public void deleteAllBooks(Account seller) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Lấy người dùng trong Security Context Holder
		if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString()))) {
			bookRepo.deleteAll();
		} else {
			bookRepo.deleteByUser_Id(seller.getId());
		}
	}
	
	//Kiểm trả Nhân viên hợp lệ (Là Admin hoặc đúng sách Người dùng bán)
	protected boolean isSellerValid(Book book, Account seller){
        boolean result = false;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Lấy người dùng trong Security Context Holder
        //Có role ADMIN hoặc là Người bán cuốn Sách
        if (book.getUser().getId().equals(seller.getId()) 
        		|| (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())))) {
            result = true;
        }
        return result;
    }

}
