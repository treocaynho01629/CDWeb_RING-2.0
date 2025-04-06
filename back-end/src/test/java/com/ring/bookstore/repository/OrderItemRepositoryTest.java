package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.orders.IOrderDetailItem;
import com.ring.bookstore.model.dto.projection.orders.IOrderItem;
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
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class OrderItemRepositoryTest {

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

    private Account account;
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

        Book book = Book.builder()
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

        OrderReceipt receipt = OrderReceipt.builder()
                .user(account)
                .address(address)
                .build();
        receipt.setCreatedDate(LocalDateTime.now());
        receiptRepo.save(receipt);

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
        List<OrderDetail> details = List.of(detail, detail2);
        detailRepo.saveAll(details);

        item = OrderItem.builder()
                .detail(detail)
                .book(book)
                .quantity((short) 99)
                .build();
        OrderItem item2 = OrderItem.builder()
                .detail(detail)
                .book(book)
                .build();
        OrderItem item3 = OrderItem.builder()
                .detail(detail2)
                .book(book2)
                .build();
        List<OrderItem> items = List.of(item, item2, item3);
        itemRepo.saveAll(items);
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    public void givenNewOrderItem_whenSaveOrderItem_ThenReturnOrderItem() {
        OrderItem item4 = OrderItem.builder()
                .detail(detail)
                .build();
        itemRepo.save(item4);

        OrderItem savedItem = itemRepo.save(item4);

        assertNotNull(savedItem);
        assertNotNull(savedItem.getId());
    }

    @Test
    public void whenUpdateOrderDetail_ThenReturnUpdatedOrderDetail() {
        OrderItem foundItem = itemRepo.findById(item.getId()).orElse(null);
        assertNotNull(foundItem);
        foundItem.setQuantity((short) 1);
        foundItem.setDiscount(BigDecimal.valueOf(0.3));

        OrderItem updatedItem = itemRepo.save(foundItem);

        assertNotNull(updatedItem);
        assertNotNull(updatedItem.getDiscount());
        assertEquals((short) 1, updatedItem.getQuantity());
    }

    @Test
    public void whenDeleteOrderItem_ThenFindNull() {
        itemRepo.deleteById(item.getId());

        OrderItem foundItem = itemRepo.findById(item.getId()).orElse(null);

        assertNull(foundItem);
    }

    @Test
    public void whenFindItemsWithDetailIds_ThenReturnItems() {
        List<IOrderItem> foundItems = itemRepo.findAllWithDetailIds(List.of(detail.getId()));

        assertNotNull(foundItems);
        assertEquals(2, foundItems.size());
    }

    @Test
    public void whenFindOrderDetailItems_ThenReturnList() {
        List<IOrderDetailItem> foundList = itemRepo.findOrderDetailItems(detail.getId(), account.getId());

        assertNotNull(foundList);
        assertEquals(2, foundList.size());
    }
}