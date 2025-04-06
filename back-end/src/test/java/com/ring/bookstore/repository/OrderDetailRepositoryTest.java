package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.orders.IOrderDetail;
import com.ring.bookstore.model.enums.OrderStatus;
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

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class OrderDetailRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private AddressRepository addressRepo;

    @Autowired
    private OrderReceiptRepository receiptRepo;

    @Autowired
    private OrderDetailRepository detailRepo;

    @Autowired
    private OrderItemRepository itemRepo;

    @PersistenceContext
    private EntityManager entityManager;

    private Book book;
    private Account account;
    private OrderReceipt receipt;
    private OrderDetail detail;
    private OrderItem item;

    @BeforeEach
    void setUp() {
        account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        Account savedAccount = accountRepo.save(account);

        Shop shop = Shop.builder().name("shop").owner(savedAccount).build();
        shop.setCreatedDate(LocalDateTime.now());
        Shop savedShop = shopRepo.save(shop);

        Image image = Image.builder().name("image").build();
        Image image2 = Image.builder().name("image2").build();

        book = Book.builder()
                .title("test")
                .image(image)
                .shop(savedShop)
                .build();
        Book book2 = Book.builder()
                .title("test2")
                .image(image2)
                .shop(savedShop)
                .build();
        book.setCreatedDate(LocalDateTime.now());
        book2.setCreatedDate(LocalDateTime.now());
        bookRepo.saveAll(List.of(book, book2));

        Address address = Address.builder()
                .address("123/abc/j12")
                .build();
        Address address2 = Address.builder()
                .address("321/abc/j12")
                .build();

        addressRepo.saveAll(List.of(address, address2));

        receipt = OrderReceipt.builder()
                .user(account)
                .address(address)
                .build();
        OrderReceipt receipt2 = OrderReceipt.builder()
                .user(account)
                .address(address2)
                .build();
        receipt.setCreatedDate(LocalDateTime.now());
        receipt2.setCreatedDate(LocalDateTime.now());
        List<OrderReceipt> receipts = List.of(receipt, receipt2);
        receiptRepo.saveAll(receipts);

        detail = OrderDetail.builder()
                .order(receipt)
                .status(OrderStatus.PENDING)
                .shop(shop)
                .build();
        OrderDetail detail2 = OrderDetail.builder()
                .order(receipt)
                .status(OrderStatus.COMPLETED)
                .shop(shop)
                .build();
        OrderDetail detail3 = OrderDetail.builder()
                .order(receipt2)
                .status(OrderStatus.COMPLETED)
                .shop(shop)
                .build();
        List<OrderDetail> details = List.of(detail, detail2, detail3);
        detailRepo.saveAll(details);

        item = OrderItem.builder()
                .detail(detail)
                .book(book)
                .build();
        OrderItem item2 = OrderItem.builder()
                .detail(detail2)
                .book(book)
                .build();
        OrderItem item3 = OrderItem.builder()
                .detail(detail3)
                .book(book2)
                .build();
        List<OrderItem> items = List.of(item, item2, item3);
        itemRepo.saveAll(items);
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    public void givenNewOrderDetail_whenSaveOrderDetail_ThenReturnOrderDetail() {
        OrderDetail detail4 = OrderDetail.builder()
                .order(receipt)
                .status(OrderStatus.PENDING)
                .build();
        detailRepo.save(detail4);

        OrderDetail savedDetail = detailRepo.save(detail4);

        assertNotNull(savedDetail);
        assertNotNull(savedDetail.getId());
    }

    @Test
    public void whenUpdateOrderDetail_ThenReturnUpdatedOrderDetail() {
        OrderDetail foundDetail = detailRepo.findById(detail.getId()).orElse(null);
        assertNotNull(foundDetail);
        foundDetail.setStatus(OrderStatus.CANCELED);
        foundDetail.setDiscount(10000.0);

        OrderDetail updatedDetail = detailRepo.save(foundDetail);

        assertNotNull(updatedDetail);
        assertNotNull(updatedDetail.getDiscount());
        assertEquals(OrderStatus.CANCELED, updatedDetail.getStatus());
    }

    @Test
    public void whenDeleteOrderDetail_ThenFindNull() {
        detailRepo.deleteById(detail.getId());

        OrderDetail foundDetail = detailRepo.findById(detail.getId()).orElse(null);
        OrderItem foundItem = itemRepo.findById(item.getId()).orElse(null);

        assertNull(foundDetail);
        assertNull(foundItem);
    }

    @Test
    public void whenFindDetailById_ThenReturnOrderDetail() {
        OrderDetail foundDetail = detailRepo.findDetailById(detail.getId()).orElse(null);

        assertNotNull(foundDetail);
        assertEquals(detail.getId(), foundDetail.getId());
    }

    @Test
    public void whenFindAllIdsByUserId_ThenReturnIds() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Long> foundIds = detailRepo.findAllIdsByUserId(
                account.getId(),
                OrderStatus.COMPLETED,
                "",
                pageable);

        assertNotNull(foundIds);
        assertEquals(2, foundIds.getTotalElements());
    }

    @Test
    public void whenFindAllIdsByBookId_ThenReturnIds() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Long> foundIds = detailRepo.findAllIdsByBookId(book.getId(), pageable);

        assertNotNull(foundIds);
        assertEquals(2, foundIds.getTotalElements());
    }

    @Test
    public void whenFindAllByReceiptIds_ThenReturnOrderDetails() {
        List<IOrderDetail> orderDetails = detailRepo.findAllByReceiptIds(List.of(receipt.getId()));

        assertNotNull(orderDetails);
        assertEquals(2, orderDetails.size());
    }
}