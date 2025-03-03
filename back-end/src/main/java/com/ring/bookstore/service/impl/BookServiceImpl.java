package com.ring.bookstore.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.github.slugify.Slugify;
import com.ring.bookstore.dtos.books.*;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.dtos.images.IImageInfo;
import com.ring.bookstore.dtos.mappers.DashboardMapper;
import com.ring.bookstore.enums.BookType;
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

import com.ring.bookstore.dtos.mappers.BookMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.request.BookRequest;
import com.ring.bookstore.service.BookService;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepo;
    private final BookDetailRepository detailRepo;
    private final PublisherRepository pubRepo;
    private final CategoryRepository cateRepo;
    private final ShopRepository shopRepo;
    private final ImageRepository imageRepo;

    private final ImageService imageService;

    private final BookMapper bookMapper;
    private final DashboardMapper dashMapper;
    private final Slugify slg = Slugify.builder().lowerCase(false).build();

    //Get random books
    public List<BookDisplayDTO> getRandomBooks(Integer amount, Boolean withDesc) {
        List<IBookDisplay> booksList = bookRepo.findRandomBooks(amount, withDesc);
        List<BookDisplayDTO> bookDTOS = booksList.stream().map(bookMapper::displayToDTO).collect(Collectors.toList()); //Return books
        return bookDTOS;
    }

    public List<BookDisplayDTO> getBooksInIds(List<Long> ids) {
        List<IBookDisplay> booksList = bookRepo.findBooksDisplayInIds(ids);
        List<BookDisplayDTO> bookDTOS = booksList.stream().map(bookMapper::displayToDTO).collect(Collectors.toList()); //Return books
        return bookDTOS;
    }

    //Get books with filter
    public Page<BookDisplayDTO> getBooks(Integer pageNo,
                                         Integer pageSize,
                                         String sortBy,
                                         String sortDir,
                                         String keyword,
                                         Integer rating,
                                         Integer amount,
                                         Integer cateId,
                                         List<Integer> pubIds,
                                         List<BookType> types,
                                         Long shopId,
                                         Long userId,
                                         Double fromRange,
                                         Double toRange,
                                         Boolean withDesc) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());

        //Fetch from database
        Page<IBookDisplay> booksList = bookRepo.findBooksWithFilter(
                keyword,
                cateId,
                pubIds,
                types,
                shopId,
                userId,
                fromRange,
                toRange,
                withDesc,
                rating,
                amount,
                pageable);
        Page<BookDisplayDTO> bookDTOS = booksList.map(bookMapper::displayToDTO);
        return bookDTOS;
    }

    public BookDTO getBook(Long id) {
        IBook book = detailRepo.findBook(id).orElseThrow(() ->
                new ResourceNotFoundException("Product not found!"));
        List<Long> imageIds = book.getPreviews() != null ? book.getPreviews() : new ArrayList<>();
        imageIds.add(book.getImage());

        List<IImageInfo> images = imageRepo.findInfo(imageIds);
        BookDTO bookDTO = bookMapper.projectionToDTO(book, images); //Map to DTO
        return bookDTO;
    }

    //Get book with detail
    public BookDetailDTO getBookDetail(Long id) {
        IBookDetail book = detailRepo.findBookDetail(id, null).orElseThrow(() ->
                new ResourceNotFoundException("Product not found!"));
        BookDetailDTO bookDetailDTO = bookMapper.detailToDTO(book); //Map to DTO
        return bookDetailDTO;
    }

    public BookDetailDTO getBookDetail(String slug) {
        IBookDetail book = detailRepo.findBookDetail(null, slug).orElseThrow(() ->
                new ResourceNotFoundException("Product not found!"));
        BookDetailDTO bookDetailDTO = bookMapper.detailToDTO(book); //Map to DTO
        return bookDetailDTO;
    }

    @Override
    public List<String> getBooksSuggestion(String keyword) {
        return bookRepo.findSuggestion(keyword);
    }

    //Add book (SELLER)
    @Transactional
    public BookResponseDTO addBook(BookRequest request,
                                   MultipartFile thumbnail,
                                   MultipartFile[] images,
                                   Account user) throws IOException, ImageResizerException {
        //Validation
        Category cate = cateRepo.findById(request.getCateId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(() -> new ResourceNotFoundException("Publisher not found"));
        Shop shop = shopRepo.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFoundException("Shop not found"));
        if (!isOwnerValid(shop, user)) throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid owner!");

        //Thumbnail
        Image savedThumbnail = imageService.upload(thumbnail);

        //Slugify
        String slug = slg.slugify(request.getTitle());

        //Create new book
        var book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .image(savedThumbnail)
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

        //Images upload
        ArrayList<Image> previewImages = new ArrayList<>();
        if (images != null && images.length != 0) {
            Arrays.stream(images).forEach(image -> {
                try {
                    previewImages.add(imageService.upload(image));
                } catch (Exception e) {
                    throw new HttpResponseException(HttpStatus.EXPECTATION_FAILED, "Upload image failed!");
                }
            });
        }

        //Create book details
        var bookDetail = BookDetail.builder()
                .book(addedBook)
                .bWeight(request.getWeight())
                .size(request.getSize())
                .pages(request.getPages())
                .bLanguage(request.getLanguage())
                .bDate(request.getDate())
                .previewImages(previewImages)
                .build();
        BookDetail addedDetail = detailRepo.save(bookDetail); //Save details to database

        //Return added book
        addedBook.setDetail(addedDetail);
        return bookMapper.bookToResponseDTO(addedBook);
    }

    //Update book (SELLER)
    @Transactional
    public BookResponseDTO updateBook(Long id,
                                      BookRequest request,
                                      MultipartFile thumbnail,
                                      MultipartFile[] images,
                                      Account user) throws IOException, ImageResizerException {
        //Check book exists & category, publisher validation
        Book book = bookRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        Category cate = cateRepo.findById(request.getCateId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Publisher pub = pubRepo.findById(request.getPubId()).orElseThrow(() -> new ResourceNotFoundException("Publisher not found"));
        BookDetail currDetail = book.getDetail();
        List<Long> removeImageIds = request.getRemoveIds();
        boolean isRemove = removeImageIds != null && !removeImageIds.isEmpty();

        //Check if correct owner
        if (!isOwnerValid(book.getShop(), user)) throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        //Image upload/replace
        if (thumbnail != null) { //Contain new image >> upload/replace
            Image oldImage = book.getImage();
            Image savedImage = imageService.upload(thumbnail); //Upload new image
            book.setImage(savedImage); //Set new image
            currDetail.addImage(oldImage);
        } else if (request.getThumbnailId() != null
                && !request.getThumbnailId().equals(book.getImage().getId())) {
            Image oldImage = book.getImage();
            Image newImage = imageRepo.findBookImage(id, request.getThumbnailId())
                    .orElseThrow(() -> new ResourceNotFoundException("Image not found!"));
            book.setImage(newImage); //Set new image
            currDetail.addImage(oldImage);
        }

        //Set new details info
        currDetail.setBWeight(request.getWeight());
        currDetail.setSize(request.getSize());
        currDetail.setPages(request.getPages());
        currDetail.setBLanguage(request.getLanguage());
        currDetail.setBDate(request.getDate());

        //Images
        if (images != null && images.length != 0) {
            Arrays.stream(images).forEach(image -> {
                try {
                    currDetail.addImage(imageService.upload(image));
                } catch (Exception e) {
                    throw new HttpResponseException(HttpStatus.EXPECTATION_FAILED, "Upload image failed!");
                }
            });
        }
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

        //Delete images
        if (isRemove) imageRepo.deleteAllById(imageRepo.findBookImages(id, removeImageIds));

        return bookMapper.bookToResponseDTO(updatedBook);
    }

    public StatDTO getAnalytics(Long shopId) {
        return dashMapper.statToDTO(bookRepo.getBookAnalytics(shopId),
                "books",
                "Sản phẩm");
    }

    //Delete book (SELLER)
    @Transactional
    public BookResponseDTO deleteBook(Long id, Account user) {
        Book book = bookRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        //Check if correct owner
        if (!isOwnerValid(book.getShop(), user)) throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        bookRepo.deleteById(id); //Delete from database
        return bookMapper.bookToResponseDTO(book);
    }

    //Delete multiples books (SELLER)
    @Transactional
    public void deleteBooks(List<Long> ids, Account user) {
        List<Long> deleteIds = isAuthAdmin() ? ids : bookRepo.findBookIdsByInIdsAndOwner(ids, user.getId());
        bookRepo.deleteAllById(deleteIds);
    }

    //Delete multiples books (SELLER)
    @Transactional
    public void deleteBooksInverse(String keyword,
                                   Integer amount,
                                   Integer rating,
                                   Integer cateId,
                                   List<Integer> pubIds,
                                   List<BookType> types,
                                   Long shopId,
                                   Long userId,
                                   Double fromRange,
                                   Double toRange,
                                   List<Long> ids,
                                   Account user) {
        List<Long> deleteIds = bookRepo.findInverseIds(keyword,
                cateId,
                pubIds,
                types,
                shopId,
                isAuthAdmin() ? userId : user.getId(),
                fromRange,
                toRange,
                rating,
                amount,
                ids);
        bookRepo.deleteAllById(deleteIds);
    }

    //Delete all books (SELLER)
    @Transactional
    public void deleteAllBooks(Long shopId, Account user) {
        if (isAuthAdmin()) {
            if (shopId != null) {
                bookRepo.deleteAllByShopId(shopId);
            } else {
                bookRepo.deleteAll();
            }
        } else {
            if (shopId != null) {
                bookRepo.deleteAllByShopIdAndShop_Owner(shopId, user);
            } else {
                bookRepo.deleteAllByShop_Owner(user);
            }
        }
    }

    //Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        return (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
    }

    protected boolean isOwnerValid(Shop shop, Account user) {
        //Check if is admin or valid owner id
        boolean isAdmin = isAuthAdmin();

        if (shop != null) {
            return shop.getOwner().getId().equals(user.getId()) || isAuthAdmin();
        } else return isAdmin;
    }
}
