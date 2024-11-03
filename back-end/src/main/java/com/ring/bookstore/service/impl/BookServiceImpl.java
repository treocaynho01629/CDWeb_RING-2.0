package com.ring.bookstore.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.github.slugify.Slugify;
import com.ring.bookstore.dtos.books.BookResponseDTO;
import com.ring.bookstore.dtos.projections.IBookDetail;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.*;
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

import com.ring.bookstore.dtos.books.BookDTO;
import com.ring.bookstore.dtos.books.BookDetailDTO;
import com.ring.bookstore.dtos.projections.IBookDisplay;
import com.ring.bookstore.dtos.mappers.BookMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.request.BookRequest;
import com.ring.bookstore.service.BookService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepo;
    private final BookDetailRepository detailRepo;
    private final PublisherRepository pubRepo;
    private final CategoryRepository cateRepo;
    private final ShopRepository shopRepo;
    private final ImageService imageService;
    private final BookMapper bookMapper;
    private final Slugify slg = Slugify.builder().lowerCase(false).build();

    //Get random books
    public List<BookDTO> getRandomBooks(Integer amount) {
        List<IBookDisplay> booksList = bookRepo.findRandomBooks(amount);
        List<BookDTO> bookDtos = booksList.stream().map(bookMapper::displayToBookDTO).collect(Collectors.toList()); //Return books
        return bookDtos;
    }

    public List<BookDTO> getBooksByIds(List<Long> ids) {
        List<IBookDisplay> booksList = bookRepo.findBooksByIds(ids);
        List<BookDTO> bookDtos = booksList.stream().map(bookMapper::displayToBookDTO).collect(Collectors.toList()); //Return books
        return bookDtos;
    }

    //Get books with filter
    public Page<BookDTO> getBooks(Integer pageNo, Integer pageSize, String sortBy, String sortDir, String keyword, Integer rating, Integer amount,
                                  Integer cateId, List<Integer> pubIds, Long shopId, List<String> types, Double fromRange, Double toRange) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        //Fetch from database
        Page<IBookDisplay> booksList = bookRepo.findBooksWithFilter(keyword, cateId, pubIds, types,
                shopId, fromRange, toRange, rating, amount, pageable);
        Page<BookDTO> bookDtos = booksList.map(bookMapper::displayToBookDTO);
        return bookDtos;
    }

    //Get book with detail
    public BookDetailDTO getBookDetail(Long id, String slug) {
        IBookDetail book = bookRepo.findBookDetail(id, slug).orElseThrow(() ->
                new ResourceNotFoundException("Product not found!"));
        BookDetailDTO bookDetailDTO = bookMapper.detailToDetailDTO(book); //Map to DTO
        return bookDetailDTO;
    }

    //Add book (SELLER)
    @Transactional
    public BookResponseDTO addBook(BookRequest request, MultipartFile file, Account seller) throws IOException, ImageResizerException {
        //Validation
        Category cate = cateRepo.findById(request.getCateId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(() -> new ResourceNotFoundException("Publisher not found"));
        Shop shop = shopRepo.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFoundException("Shop not found"));
        if (!Objects.equals(shop.getOwner().getId(), seller.getId())) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid owner!");

        //Image upload
        Image savedImage = imageService.upload(file);

        //Slugify
        String slug = slg.slugify(request.getTitle());

        //Create new book
        var book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .image(savedImage)
                .price(request.getPrice())
                .discount(request.getDiscount())
                .publisher(pub)
                .cate(cate)
                .shop(shop)
                .author(request.getAuthor())
                .amount(request.getAmount())
                .type(request.getType())
                .slug(slug)
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
        BookDetail addedDetail = detailRepo.save(bookDetail); //Save details to database

        //Return added book
        addedBook.setBookDetail(addedDetail);
        return bookMapper.bookToResponseDTO(addedBook);
    }

    //Update book (SELLER)
    @Transactional
    public BookResponseDTO updateBook(Long id, BookRequest request, MultipartFile file, Account seller) throws IOException, ImageResizerException {
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
            book.setImage(savedImage); //Set new image
        }

        //FIX
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
        String slug = slg.slugify(request.getTitle());

        book.setSlug(slug);
        book.setTitle(request.getTitle());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setDiscount(request.getDiscount());
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
        if (isAuthAdmin()) {
            bookRepo.deleteAll();
        } else {
            bookRepo.deleteBySellerId(seller.getId());
        }
    }

    //Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        return (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
    }

    protected boolean isSellerValid(Book book, Account seller) {
        //Check if is admin or valid seller id
        return book.getShop().getOwner().getId().equals(seller.getId()) || isAuthAdmin();
    }
}
