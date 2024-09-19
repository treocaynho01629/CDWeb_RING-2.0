package com.ring.bookstore.service.impl;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.BookResponseDTO;
import com.ring.bookstore.dtos.projections.IBookDetail;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.service.ImageService;
import org.springframework.data.domain.Page;
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
import com.ring.bookstore.dtos.projections.IBookDisplay;
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
    private final ImageService imageService;
    private final BookMapper bookMapper;

    //Get random books
    public List<BookDTO> getRandomBooks(Integer amount) {
        List<IBookDisplay> booksList = bookRepo.findRandomBooks(amount);
        List<BookDTO> bookDtos = booksList.stream().map(bookMapper::displayToBookDTO).collect(Collectors.toList()); //Return books
        return bookDtos;
    }

    //Get books with filter
    public Page<BookDTO> getBooks(Integer pageNo, Integer pageSize, String sortBy, String sortDir, String keyword, Integer rating, Integer amount,
                                  Integer cateId, List<Integer> pubId, String seller, String type, Double fromRange, Double toRange) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        //Fetch from database
        Page<IBookDisplay> booksList = bookRepo.findBooksWithFilter(keyword
                , cateId
                , pubId
                , seller
                , type
                , fromRange
                , toRange
                , rating
                , amount
                , pageable);
        Page<BookDTO> bookDtos = booksList.map(bookMapper::displayToBookDTO);
        return bookDtos;
    }

    //Get display book info by {id}
    public BookDetailDTO getBookDetailById(Long id) {
        IBookDetail book = bookRepo.findBookDetailById(id).orElseThrow(() ->
                new ResourceNotFoundException("Product does not exists!"));
        BookDetailDTO bookDetailDTO = bookMapper.detailToDetailDTO(book); //Map to DTO
        return bookDetailDTO;
    }

    //Add book (SELLER)
    @Transactional
    public BookResponseDTO addBook(BookRequest request, MultipartFile file, Account seller) throws IOException, ImageResizerException {
        //Category & publisher validation
        Category cate = cateRepo.findById(request.getCateId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(() -> new ResourceNotFoundException("Publisher not found"));

        //Image upload
        Image savedImage = imageService.upload(file);

        //Create new book
        var book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .image(savedImage)
                .price(request.getPrice())
                .publisher(pub)
                .cate(cate)
                .seller(seller)
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
        return bookMapper.bookToResponseDTO(addedBook);
    }

    //Update book (SELLER)
    @Transactional
    public BookResponseDTO updateBook(BookRequest request, MultipartFile file, Long id, Account seller) throws IOException, ImageResizerException {
        //Check book exists & category, publisher validation
        Book book = bookRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        Category cate = cateRepo.findById(request.getCateId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(() -> new ResourceNotFoundException("Publisher not found"));

        //Check if correct seller or admin
        if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

//        if (remove != null) {
//            if (hasThumbnail && file == null) throw new;
//            //loop + remove
//        }

        //Image upload/replace
        if (file != null) { //Contain new image >> upload/replace
            imageService.deleteImage(book.getImage().getId()); //Delete old image
            Image savedImage = imageService.upload(file); //Upload new image
            book.setImage(savedImage); //Save to database
        }

//        //Preview images
//        if (files != null) {
//            //upload
//        }

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

        //Update
        Book updatedBook = bookRepo.save(book);
        return bookMapper.bookToResponseDTO(updatedBook);
    }

    //Delete book (SELLER)
    @Transactional
    public BookResponseDTO deleteBook(Long id, Account seller) {
        Book book = bookRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        //Check if correct seller or admin
        if (!isSellerValid(book, seller)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

        bookRepo.deleteById(id); //Delete from database
        return bookMapper.bookToResponseDTO(book);
    }

    //Delete multiples books (SELLER)
    @Transactional
    public void deleteBooks(List<Long> ids, Account seller) {
        //Loop and delete
        for (Long id : ids) {
            Book book = bookRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
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
            bookRepo.deleteBySellerId(seller.getId());
        }
    }

    //Check valid role function
    protected boolean isSellerValid(Book book, Account seller) {
        boolean result = false;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current user
        //Check if is admin or valid seller id
        if (book.getSeller().getId().equals(seller.getId())
                || (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())))) {
            result = true;
        }
        return result;
    }
}
