package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.response.categories.ICategory;
import com.ring.bookstore.model.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CategoryRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private CategoryRepository cateRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private AccountRepository accountRepo;

    @PersistenceContext
    private EntityManager entityManager;

    private Category cate;
    private Category childCate;
    private Shop shop;

    @BeforeEach
    void setUp() {
        Account account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        Account savedAccount = accountRepo.save(account);

        shop = Shop.builder().name("shop").owner(savedAccount).build();
        shop.setCreatedDate(LocalDateTime.now());
        Shop savedShop = shopRepo.save(shop);

        cate = Category.builder()
                .name("test")
                .slug("test")
                .build();
        Category cate2 = Category.builder()
                .name("test2")
                .slug("test2")
                .build();
        List<Category> categories = List.of(cate, cate2);
        List<Category> savedCates = cateRepo.saveAll(categories);

        childCate = Category.builder()
                .name("testChild")
                .slug("slug")
                .parent(savedCates.get(0))
                .build();
        savedCates.add(cateRepo.save(childCate));
        entityManager.flush();
        entityManager.clear();

        Image image = Image.builder().publicId("image").build();
        Image image2 = Image.builder().publicId("image2").build();
        Image image3 = Image.builder().publicId("image3").build();

        Book book = Book.builder()
                .image(image)
                .cate(savedCates.get(0))
                .build();
        Book book2 = Book.builder()
                .image(image2)
                .cate(savedCates.get(1))
                .shop(savedShop)
                .build();
        Book book3 = Book.builder()
                .image(image3)
                .cate(savedCates.get(2))
                .build();
        book.setCreatedDate(LocalDateTime.now());
        book2.setCreatedDate(LocalDateTime.now());
        book3.setCreatedDate(LocalDateTime.now());
        List<Book> books = List.of(book, book2, book3);
        bookRepo.saveAll(books);
    }

    @Test
    public void givenNewCategory_whenSaveCategory_ThenReturnCategory() {
        Category category = Category.builder()
                .name("Fiction")
                .slug("fiction")
                .parent(cate)
                .build();

        Category savedCategory = cateRepo.save(category);

        assertNotNull(savedCategory);
        assertNotNull(savedCategory.getId());
    }

    @Test
    public void whenUpdateCategory_ThenReturnUpdatedCategory() {
        Category foundCate = cateRepo.findById(childCate.getId()).orElse(null);
        assertNotNull(foundCate);
        foundCate.setSlug("science-fiction");
        foundCate.setDescription("Science Fiction");
        foundCate.setParent(null);

        Category updatedCategory = cateRepo.save(foundCate);

        assertNotNull(updatedCategory);
        assertNotNull(updatedCategory.getDescription());
        assertNull(updatedCategory.getParent());
        assertEquals("science-fiction", updatedCategory.getSlug());
    }

    @Test
    public void whenDeleteCategory_ThenFindNull() {
        cateRepo.deleteById(cate.getId());

        Category foundCategory = cateRepo.findById(cate.getId()).orElse(null);
        Category foundCategory2 = cateRepo.findById(childCate.getId()).orElse(null);

        assertNull(foundCategory);
        assertNull(foundCategory2);
    }

    @Test
    public void whenFindCategories_ThenReturnPagedResult() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ICategory> foundCates = cateRepo.findCates(null, pageable);
        Page<ICategory> foundCates2 = cateRepo.findCates(cate.getId(), pageable);

        assertNotNull(foundCates);
        assertNotNull(foundCates2);
        assertEquals(2, foundCates.getContent().size());
        assertEquals(1, foundCates2.getContent().size());
    }

    @Test
    public void whenFindCategoriesWithIds_ThenReturnCorrectList() {
        List<Category> categories = cateRepo.findAll();
        List<Integer> ids = categories.stream().map(Category::getId).collect(Collectors.toList());
        ids.remove(0);

        List<ICategory> foundCates = cateRepo.findCatesWithIds(ids);

        assertNotNull(foundCates);
        assertEquals(2, foundCates.size());
    }

    @Test
    public void whenFindParentAndSubCategories_ThenReturnCorrectList() {
        List<Integer> ids = List.of(cate.getId());
        List<ICategory> foundCates = cateRepo.findParentAndSubCatesWithParentIds(ids);

        assertNotNull(foundCates);
        assertEquals(2, foundCates.size());
    }

    @Test
    public void whenFindCateIds_ThenReturnCorrectList() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Integer> foundIds = cateRepo.findCateIdsByParent(null, pageable);
        Page<Integer> foundIds2 = cateRepo.findCateIdsByParent(cate.getId(), pageable);

        assertNotNull(foundIds);
        assertNotNull(foundIds2);
        assertEquals(2, foundIds.getContent().size());
        assertEquals(1, foundIds2.getContent().size());
    }

    @Test
    public void whenFindRelevantCategories_ThenReturnCorrectArray() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Integer[]> foundArrays = cateRepo.findRelevantCategories(shop.getId(), pageable);

        assertNotNull(foundArrays);
        assertEquals(1, foundArrays.getContent().size());
    }

    @Test
    public void whenFindPreviewCategories_ThenReturnCategoriesWithImagePublicId() {
        List<ICategory> foundCates = cateRepo.findPreviewCategories();

        assertNotNull(foundCates);
        assertEquals(3, foundCates.size());
        assertNotNull(foundCates.get(0).getPublicId());
    }

    @Test
    public void whenFindCategoryByIdOrSlug_ThenReturnCorrectCategory() {
        Category foundCate = cateRepo.findCate(cate.getId(), null).orElse(null);
        Category foundCate2 = cateRepo.findCate(null, cate.getSlug()).orElse(null);

        assertNotNull(foundCate);
        assertNotNull(foundCate2);
        assertEquals(foundCate, foundCate2);
    }

    @Test
    public void whenFindCategoryWithChildren_ThenReturnCorrectCategory() {
        Category foundCate = cateRepo.findCateWithChildren(cate.getId(), null).orElse(null);

        assertNotNull(foundCate);
        assertNotNull(foundCate.getSubCates());
    }

    @Test
    public void whenFindCategoryWithParent_ThenReturnCorrectCategory() {
        Category foundCate = cateRepo.findCateWithParent(childCate.getId(), null).orElse(null);

        assertNotNull(foundCate);
        assertNotNull(foundCate.getParent());
    }

    @Test
    public void whenFindInverseCategoryIds_ThenReturnCorrectSize() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ICategory> foundCates = cateRepo.findCates(null, pageable);
        List<Integer> foundIds = foundCates.getContent().stream().map(ICategory::getId).collect(Collectors.toList());
        foundIds.remove(0);

        List<Integer> inverseIds = cateRepo.findInverseIds(null, foundIds);

        assertNotNull(inverseIds);
        assertEquals(foundCates.getTotalElements() - foundIds.size(), inverseIds.size());
    }
}