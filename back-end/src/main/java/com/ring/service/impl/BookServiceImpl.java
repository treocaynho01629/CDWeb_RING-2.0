package com.ring.service.impl;

import com.github.slugify.Slugify;
import com.ring.dto.projection.books.IBook;
import com.ring.dto.projection.books.IBookDetail;
import com.ring.dto.projection.books.IBookDisplay;
import com.ring.dto.request.BookRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.books.BookDTO;
import com.ring.dto.response.books.BookDetailDTO;
import com.ring.dto.response.books.BookDisplayDTO;
import com.ring.dto.response.books.BookResponseDTO;
import com.ring.dto.response.dashboard.StatDTO;
import com.ring.exception.EntityOwnershipException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.mapper.BookMapper;
import com.ring.mapper.DashboardMapper;
import com.ring.model.entity.*;
import com.ring.model.enums.BookType;
import com.ring.model.enums.UserRole;
import com.ring.repository.*;
import com.ring.service.BookService;
import com.ring.service.ImageService;
import com.ring.utils.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<BookDisplayDTO> getRandomBooks(Integer amount, Boolean withDesc) {
        List<IBookDisplay> booksList = bookRepo.findRandomBooks(amount, withDesc);
        List<BookDisplayDTO> bookDTOS = booksList.stream().map(bookMapper::displayToDTO).collect(Collectors.toList());
        return bookDTOS;
    }

    @Cacheable("books")
    public List<BookDisplayDTO> getBooksInIds(List<Long> ids) {
        List<IBookDisplay> booksList = bookRepo.findBooksDisplayInIds(ids);
        List<BookDisplayDTO> bookDTOS = booksList.stream().map(bookMapper::displayToDTO).collect(Collectors.toList());
        return bookDTOS;
    }

    @Cacheable("books")
    public PagingResponse<BookDisplayDTO> getBooks(Integer pageNo,
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
        Pageable pageable = PageRequest.of(pageNo, pageSize,
                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        // Fetch from database
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
        List<BookDisplayDTO> bookDTOS = booksList.map(bookMapper::displayToDTO).toList();
        return new PagingResponse<>(
                bookDTOS,
                booksList.getTotalPages(),
                booksList.getTotalElements(),
                booksList.getSize(),
                booksList.getNumber(),
                booksList.isEmpty());
    }

    @Cacheable(cacheNames = "book", key = "#id")
    public BookDTO getBook(Long id) {
        IBook book = detailRepo.findBook(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!",
                        "Không tìm thấy sản phẩm yêu cầu!"));
        List<Long> imageIds = book.getPreviews() != null ? book.getPreviews() : new ArrayList<>();
        imageIds.add(book.getImage());

        List<Image> images = imageRepo.findImages(imageIds);
        BookDTO bookDTO = bookMapper.projectionToDTO(book, images); // Map to DTO
        return bookDTO;
    }

    @Cacheable(cacheNames = "bookDetail", key = "#id")
    public BookDetailDTO getBookDetail(Long id) {
        IBookDetail book = detailRepo.findBookDetail(id, null)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!",
                        "Không tìm thấy sản phẩm yêu cầu!"));
        BookDetailDTO bookDetailDTO = bookMapper.detailToDTO(book); // Map to DTO
        return bookDetailDTO;
    }

    @Cacheable(cacheNames = "bookDetail", key = "#slug")
    public BookDetailDTO getBookDetail(String slug) {
        IBookDetail book = detailRepo.findBookDetail(null, slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!",
                        "Không tìm thấy sản phẩm yêu cầu!"));
        BookDetailDTO bookDetailDTO = bookMapper.detailToDTO(book); // Map to DTO
        return bookDetailDTO;
    }

    @Cacheable(cacheNames = "booksSuggestion", key = "#keyword")
    public List<String> getBooksSuggestion(String keyword) {
        return bookRepo.findSuggestion(keyword);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = { "books", "booksSuggestion", "bookAnalytics" }, allEntries = true),
            @CacheEvict(cacheNames = { "book", "bookDetail" }, key = "#id"),
            @CacheEvict(cacheNames = "bookDetail", key = "#result.slug", condition = "#result != null") })
    @Transactional
    public BookResponseDTO addBook(BookRequest request,
            MultipartFile thumbnail,
            MultipartFile[] images,
            Account user) {
        // Validation
        Category cate = cateRepo.findById(request.getCateId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found!",
                        "Không tìm thấy danh mục yêu cầu!"));
        Publisher pub = pubRepo.findById(request.getPubId())
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found!",
                        "Không tìm thấy nhà xuất bản yêu cầu!"));
        Shop shop = shopRepo.findById(request.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                        "Không tìm thấy cửa hàng yêu cầu!"));
        if (!isOwnerValid(shop, user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không phải chủ sở hữu của cửa hàng này!");

        // Thumbnail
        Image savedThumbnail = imageService.upload(thumbnail, FileUploadUtil.PRODUCT_FOLDER);

        // Slugify
        String slug = slg.slugify(request.getTitle());

        // Create new book
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
        Book addedBook = bookRepo.save(book); // Save to database

        // Images upload
        ArrayList<Image> previewImages = new ArrayList<>();
        if (images != null && images.length != 0) {
            previewImages.addAll(imageService.uploadMultiple(Arrays.asList(images), FileUploadUtil.PRODUCT_FOLDER));
        }

        // Create book details
        var bookDetail = BookDetail.builder()
                .book(addedBook)
                .bWeight(request.getWeight())
                .size(request.getSize())
                .pages(request.getPages())
                .bLanguage(request.getLanguage())
                .bDate(request.getDate())
                .previewImages(previewImages)
                .build();
        BookDetail addedDetail = detailRepo.save(bookDetail); // Save details to database

        // Return added book
        addedBook.setDetail(addedDetail);
        return bookMapper.bookToResponseDTO(addedBook);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = { "books", "booksSuggestion" }, allEntries = true),
            @CacheEvict(cacheNames = { "book", "bookDetail" }, key = "#id"),
            @CacheEvict(cacheNames = "bookDetail", key = "#result.slug", condition = "#result != null") })
    @Transactional
    public BookResponseDTO updateBook(Long id,
            BookRequest request,
            MultipartFile thumbnail,
            MultipartFile[] images,
            Account user) {
        // Check book exists & category, publisher validation
        Book book = bookRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!",
                        "Không tìm thấy sản phẩm yêu cầu!"));
        Category cate = cateRepo.findById(request.getCateId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found!",
                        "Không tìm thấy danh mục yêu cầu!"));
        Publisher pub = pubRepo.findById(request.getPubId())
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found!",
                        "Không tìm thấy nhà xuất bản yêu cầu!"));
        BookDetail currDetail = book.getDetail();
        List<Long> removeImageIds = request.getRemoveIds();
        boolean isRemove = removeImageIds != null && !removeImageIds.isEmpty();

        // Check if correct owner
        if (!isOwnerValid(book.getShop(), user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không phải chủ sở hữu của sản phẩm này!");

        // Image upload/replace
        if (thumbnail != null) { // Contain new image >> upload/replace
            Image oldImage = book.getImage();
            Image savedImage = imageService.upload(thumbnail, FileUploadUtil.PRODUCT_FOLDER); // Upload new image
            book.setImage(savedImage); // Set new thumbnail
            currDetail.addImage(oldImage); // Put old thumbnail to preview
        } else if (request.getThumbnailId() != null
                && !request.getThumbnailId().equals(book.getImage().getId())) {
            Image oldImage = book.getImage();
            Image newImage = imageRepo.findBookImage(id, request.getThumbnailId())
                    .orElseThrow(() -> new ResourceNotFoundException("Image not found!",
                            "Không tìm thấy hình ảnh yêu cầu!"));
            book.setImage(newImage); // Set new image
            currDetail.addImage(oldImage);
        }

        // Set new details info
        currDetail.setBWeight(request.getWeight());
        currDetail.setSize(request.getSize());
        currDetail.setPages(request.getPages());
        currDetail.setBLanguage(request.getLanguage());
        currDetail.setBDate(request.getDate());

        // Images
        if (images != null && images.length != 0) {
            imageService.uploadMultiple(Arrays.asList(images), FileUploadUtil.PRODUCT_FOLDER)
                    .forEach(currDetail::addImage);
        }
        detailRepo.save(currDetail); // Save new details to database

        // Set new info
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

        // Update
        Book updatedBook = bookRepo.save(book);

        // Delete images
        if (isRemove)
            imageService.deleteImages(imageRepo.findBookImagePublicIds(id, removeImageIds));

        return bookMapper.bookToResponseDTO(updatedBook);
    }

    @Cacheable("bookAnalytics")
    public StatDTO getAnalytics(Long shopId,
            Long userId) {
        return dashMapper.statToDTO(bookRepo.getBookAnalytics(shopId, userId),
                "books",
                "Sản phẩm");
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "books", "booksSuggestion", "bookAnalytics" }, allEntries = true),
            @CacheEvict(cacheNames = { "book", "bookDetail" }, key = "#id"),
            @CacheEvict(cacheNames = "bookDetail", key = "#result.slug", condition = "#result != null") })
    @Transactional
    public BookResponseDTO deleteBook(Long id, Account user) {
        Book book = bookRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!",
                        "Không tìm thấy sản phẩm yêu cầu!"));
        // Check if correct owner
        if (!isOwnerValid(book.getShop(), user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không có quyền chỉnh sửa sản phẩm này!");

        bookRepo.deleteById(id); // Delete from database
        return bookMapper.bookToResponseDTO(book);
    }

    @CacheEvict(cacheNames = { "book", "bookDetail", "books", "booksSuggestion" }, allEntries = true)
    @Transactional
    public void deleteBooks(List<Long> ids, Account user) {
        List<Long> deleteIds = isAuthAdmin() ? ids : bookRepo.findBookIdsByInIdsAndOwner(ids, user.getId());
        bookRepo.deleteAllById(deleteIds);
    }

    @CacheEvict(cacheNames = { "book", "bookDetail", "books", "booksSuggestion", "bookAnalytics" }, allEntries = true)

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

    @CacheEvict(cacheNames = { "book", "bookDetail", "books", "booksSuggestion", "bookAnalytics" }, allEntries = true)
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

    // Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Get current auth
        return (auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN.toString())));
    }

    protected boolean isOwnerValid(Shop shop, Account user) {
        // Check if is admin or valid owner id
        boolean isAdmin = isAuthAdmin();

        if (shop != null) {
            return shop.getOwner().getId().equals(user.getId()) || isAuthAdmin();
        } else
            return isAdmin;
    }
}
