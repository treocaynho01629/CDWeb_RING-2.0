package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.response.dashboard.IStat;
import com.ring.bookstore.model.dto.response.orders.IReceiptSummary;
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
class OrderReceiptRepositoryTest {

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
        Address address3 = Address.builder()
                .address("456/abc/j12")
                .build();

        addressRepo.saveAll(List.of(address, address2, address3));

        receipt = OrderReceipt.builder()
                .user(account)
                .address(address)
                .email("test@test.test")
                .build();
        OrderReceipt receipt2 = OrderReceipt.builder()
                .user(account)
                .address(address2)
                .build();
        OrderReceipt receipt3 = OrderReceipt.builder()
                .user(account)
                .address(address3)
                .build();
        receipt.setCreatedDate(LocalDateTime.now().minusMonths(1));
        receipt2.setCreatedDate(LocalDateTime.now().minusMonths(1));
        receipt3.setCreatedDate(LocalDateTime.now());
        List<OrderReceipt> receipts = List.of(receipt, receipt2, receipt3);
        receiptRepo.saveAll(receipts);

        detail = OrderDetail.builder()
                .order(receipt)
                .status(OrderStatus.PENDING)
                .shop(shop)
                .totalPrice(90000.0)
                .discount(10000.0)
                .build();
        OrderDetail detail2 = OrderDetail.builder()
                .order(receipt2)
                .status(OrderStatus.COMPLETED)
                .shop(shop)
                .totalPrice(30000.0)
                .discount(0.0)
                .build();
        OrderDetail detail3 = OrderDetail.builder()
                .order(receipt3)
                .status(OrderStatus.COMPLETED)
                .shop(shop)
                .totalPrice(240000.0)
                .discount(20000.0)
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
    public void givenNewOrder_whenSaveOrder_ThenReturnOrder() {
        OrderReceipt order = OrderReceipt.builder()
                .user(account)
                .build();
        receiptRepo.save(order);

        OrderReceipt savedOrder = receiptRepo.save(order);

        assertNotNull(savedOrder);
        assertNotNull(savedOrder.getId());
    }

    @Test
    public void whenUpdateOrder_ThenReturnUpdatedOrder() {
        OrderReceipt foundOrder = receiptRepo.findById(receipt.getId()).orElse(null);
        assertNotNull(foundOrder);
        foundOrder.setEmail("changed@changed.changed");
        foundOrder.setTotal(100000.0);

        OrderReceipt updatedOrder = receiptRepo.save(foundOrder);

        assertNotNull(updatedOrder);
        assertNotNull(updatedOrder.getTotal());
        assertEquals("changed@changed.changed", updatedOrder.getEmail());
    }

    @Test
    public void whenDeleteOrder_ThenFindNull() {
        receiptRepo.deleteById(receipt.getId());

        OrderReceipt foundOrder = receiptRepo.findById(receipt.getId()).orElse(null);
        OrderDetail foundDetail = detailRepo.findById(detail.getId()).orElse(null);
        OrderItem foundItem = itemRepo.findById(item.getId()).orElse(null);

        assertNull(foundOrder);
        assertNull(foundDetail);
        assertNull(foundItem);
    }

    @Test
    public void whenCheckHasUserBoughtBook_ThenReturnBoolean() {
        boolean check = receiptRepo.hasUserBoughtBook(book.getId(), account.getId());

        assertTrue(check);
    }

    @Test
    public void whenFindOrderSummaries_ThenReturnList() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IReceiptSummary> foundOrders = receiptRepo.findAllSummaries(
                null,
                account.getId(),
                book.getId(),
                pageable);

        assertNotNull(foundOrders);
        assertEquals(2, foundOrders.getTotalElements());
    }

    @Test
    public void whenOrderIds_ThenReturnIds() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Long> foundIds = receiptRepo.findAllIds(
                null,
                account.getId(),
                OrderStatus.COMPLETED,
                "",
                pageable);

        assertNotNull(foundIds);
        assertEquals(2, foundIds.getTotalElements());
    }

    @Test
    public void whenGetSalesAnalytics_ThenReturnStats() {
        IStat foundData = receiptRepo.getSalesAnalytics(null, null);

        assertNotNull(foundData);
        assertEquals(220000.0, foundData.getCurrentMonth()); //240000 - 20000
        assertEquals(30000.0, foundData.getLastMonth()); //30000 - 0 (COMPLETED)
    }
}