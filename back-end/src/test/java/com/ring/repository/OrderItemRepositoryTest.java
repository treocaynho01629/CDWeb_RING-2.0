package com.ring.repository;

import com.ring.base.AbstractRepositoryTest;
import com.ring.dto.projection.orders.IOrderItem;
import com.ring.model.entity.*;
import com.ring.model.enums.OrderStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class OrderItemRepositoryTest extends AbstractRepositoryTest {

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
        private Book book;

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
                bookRepo.saveAll(new ArrayList<>(List.of(book, book2)));

                Address address = Address.builder()
                                .address("123/abc/j12")
                                .build();
                Address address2 = Address.builder()
                                .address("321/abc/j12")
                                .build();

                addressRepo.saveAll(new ArrayList<>(List.of(address, address2)));

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
                detail.setCreatedDate(LocalDateTime.now());
                OrderDetail detail2 = OrderDetail.builder()
                                .order(receipt)
                                .status(OrderStatus.COMPLETED)
                                .shop(shop)
                                .build();
                detail2.setCreatedDate(LocalDateTime.now());
                List<OrderDetail> details = new ArrayList<>(List.of(detail, detail2));
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
                List<OrderItem> items = new ArrayList<>(List.of(item, item2, item3));
                itemRepo.saveAll(items);
                entityManager.flush();
                entityManager.clear();
        }

        @Test
        public void givenNewOrderItem_whenSaveOrderItem_ThenReturnOrderItem() {

                // Given
                OrderItem item4 = OrderItem.builder()
                                .detail(detail)
                                .build();
                itemRepo.save(item4);

                // When
                OrderItem savedItem = itemRepo.save(item4);

                // Then
                assertNotNull(savedItem);
                assertNotNull(savedItem.getId());
        }

        @Test
        public void whenUpdateOrderDetail_ThenReturnUpdatedOrderDetail() {

                // Given
                OrderItem foundItem = itemRepo.findById(item.getId()).orElse(null);
                assertNotNull(foundItem);

                // When
                foundItem.setQuantity((short) 1);
                foundItem.setDiscount(BigDecimal.valueOf(0.3));
                OrderItem updatedItem = itemRepo.save(foundItem);

                // Then
                assertNotNull(updatedItem);
                assertNotNull(updatedItem.getDiscount());
                assertEquals((short) 1, updatedItem.getQuantity());
        }

        @Test
        public void whenDeleteOrderItem_ThenFindNull() {

                // When
                itemRepo.deleteById(item.getId());

                // Then
                OrderItem foundItem = itemRepo.findById(item.getId()).orElse(null);
                OrderDetail foundDetail = detailRepo.findById(detail.getId()).orElse(null);
                Book foundBook = bookRepo.findById(book.getId()).orElse(null);

                assertNull(foundItem);
                assertNotNull(foundBook);
                assertNotNull(foundDetail);
        }

        @Test
        public void whenFindItemsWithDetailIds_ThenReturnItems() {

                // When
                List<IOrderItem> foundItems = itemRepo.findAllWithDetailIds(new ArrayList<>(List.of(detail.getId())));

                // Then
                assertNotNull(foundItems);
                assertEquals(2, foundItems.size());
        }

        // @Test
        // public void whenFindOrderDetailItems_ThenReturnList() {
        //
        // // When
        // List<IOrderDetail> foundList = itemRepo.findOrderDetailItems(detail.getId(),
        // account.getId());
        //
        // // Then
        // assertNotNull(foundList);
        // assertEquals(2, foundList.size());
        // }
}