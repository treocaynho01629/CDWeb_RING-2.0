package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import com.ring.bookstore.model.dto.projection.accounts.IAccount;
import com.ring.bookstore.model.dto.projection.dashboard.IStat;
import com.ring.bookstore.model.entity.*;
import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.model.enums.UserRole;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

class AccountRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private AccountProfileRepository profileRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PrivilegeRepository privilegeRepo;

    @Autowired
    private RefreshTokenRepository tokenRepo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private ReviewRepository reviewRepo;

    @Autowired
    private OrderReceiptRepository receiptRepo;

    @PersistenceContext
    private EntityManager entityManager;

    private Account account;
    private RefreshToken token;

    @BeforeEach
    void setUp() {
        Privilege privilege = Privilege.builder().privilegeType(PrivilegeType.CREATE_ADDRESS).build();
        Privilege savedPrivilege = privilegeRepo.save(privilege);
        Role role = Role.builder().roleName(UserRole.ROLE_GUEST).privileges(List.of(savedPrivilege)).build();
        Role savedRole = roleRepo.save(role);

        account = Account.builder()
                .username("initial")
                .pass("asd")
                .email("initialEmail@initial.com")
                .roles(List.of(savedRole))
                .resetToken("reset123")
                .build();
        Account account2 = Account.builder()
                .username("testUser")
                .pass("password")
                .email("test1@example.com")
                .resetToken("reset321")
                .roles(List.of(savedRole))
                .build();
        Account account3 = Account.builder()
                .username("testUser2")
                .pass("password")
                .email("test2@example.com")
                .resetToken("reset234")
                .roles(List.of(savedRole))
                .build();
        account.setCreatedDate(LocalDateTime.now().minusMonths(1));
        account2.setCreatedDate(LocalDateTime.now().minusMonths(1));
        account3.setCreatedDate(LocalDateTime.now());
        List<Account> accounts = List.of(account, account2, account3);
        accountRepo.saveAll(accounts);

        token = RefreshToken.builder()
                .refreshToken("test")
                .user(account)
                .build();
        tokenRepo.save(token);

        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .build();

        profileRepo.save(profile);

        entityManager.flush();
        entityManager.clear();
    }

    @Test
    public void givenNewAccount_whenSaveAccount_ThenReturnAccount() {

        // Given
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();

        // When
        Account savedAccount = accountRepo.save(account);

        // Then
        assertNotNull(savedAccount);
        assertNotNull(savedAccount.getId());
    }

    @Test
    public void whenUpdateAccount_ThenReturnAccount() {

        // Given
        Account foundAccount = accountRepo.findById(account.getId()).orElse(null);
        assertNotNull(foundAccount);

        // When
        foundAccount.setUsername("nameuser");
        foundAccount.setEmail("change@example.com");

        Account updatedAccount = accountRepo.save(foundAccount);

        // Then
        assertNotNull(updatedAccount);
        assertEquals("nameuser", updatedAccount.getUsername());
        assertEquals("change@example.com", updatedAccount.getEmail());
    }

    @Test
    public void whenDeleteAccount_ThenFindNull() {

        // Given
        Account beforeChange = accountRepo.findById(account.getId()).orElse(null);
        assertNotNull(beforeChange);

        Shop shop = Shop.builder().name("shop").owner(beforeChange).followers(Set.of(beforeChange)).build();
        shop.setCreatedDate(LocalDateTime.now());
        shopRepo.save(shop);

        Image image = Image.builder().name("image").build();

        Book book = Book.builder()
                .image(image)
                .build();
        book.setCreatedDate(LocalDateTime.now());
        bookRepo.save(book);

        Review review = Review.builder()
                .book(book)
                .user(beforeChange)
                .rating(5)
                .rContent("test")
                .build();
        review.setCreatedDate(LocalDateTime.now());
        reviewRepo.save(review);

        OrderReceipt receipt = OrderReceipt.builder()
                .user(beforeChange)
                .email("test@test.test")
                .build();
        receipt.setCreatedDate(LocalDateTime.now());
        receiptRepo.save(receipt);

        entityManager.flush();
        entityManager.clear();

        // When
        accountRepo.deleteById(account.getId());

        // Then
        Account foundAccount = accountRepo.findById(account.getId()).orElse(null);
        RefreshToken foundToken = tokenRepo.findById(token.getId()).orElse(null);
        Shop foundShop = shopRepo.findById(shop.getId()).orElse(null);
        Review foundReview = reviewRepo.findById(review.getId()).orElse(null);
        List<OrderReceipt> foundReceipts = receiptRepo.findAll();

        assertNull(foundAccount);
        assertNull(foundToken);
        assertNull(foundShop);
        assertNull(foundReview);
        assertEquals(1, foundReceipts.size());
    }

    @Test
    public void whenFindByUsername_ThenReturnAccount() {

        // When
        Account foundAccount = accountRepo.findByUsername("initial").orElse(null);

        // Then
        assertNotNull(foundAccount);
        assertEquals("initial", foundAccount.getUsername());
    }

    @Test
    public void whenFindByRefreshTokenAndUsername_ThenReturnAccount() {

        // When
        Account foundAccount = accountRepo.findByRefreshTokenAndUsername("test", "initial").orElse(null);

        // Then
        assertNotNull(foundAccount);
    }

    @Test
    public void whenFindByResetToken_ThenReturnAccount() {

        // When
        Account foundAccount = accountRepo.findByResetToken("reset321").orElse(null);

        // Then
        assertNotNull(foundAccount);
    }

    @Test
    public void whenFindAccountsWithFilter_ThenReturnTheRightListSize() {

        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<IAccount> accountsList = accountRepo.findAccountsWithFilter("test", null, pageable);

        // Then
        assertNotNull(accountsList);
        assertEquals(2, accountsList.getContent().size());
    }

    @Test
    public void whenFindInverseIds_ThenReturnCorrectSize() {

        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<IAccount> foundAccounts = accountRepo.findAccountsWithFilter("test", null, pageable);
        List<Long> foundIds = foundAccounts.getContent().stream().map(IAccount::getId).collect(Collectors.toList());
        foundIds.remove(0);

        // When
        List<Long> inverseIds = accountRepo.findInverseIds("test", null, foundIds);

        // Then
        assertNotNull(inverseIds);
        assertEquals(foundAccounts.getTotalElements() - foundIds.size(), inverseIds.size());
    }

    @Test
    public void whenGetAccountAnalytics_ThenReturnStats() {

        // When
        IStat foundData = accountRepo.getAccountAnalytics();

        // Then
        assertNotNull(foundData);
        assertEquals(2, foundData.getLastMonth());
        assertEquals(1, foundData.getCurrentMonth());
    }

    @Test
    public void whenClearResetToken_ThenResetTokenIsNull() {

        // When
        accountRepo.clearResetToken("reset123");
        entityManager.flush();
        entityManager.clear();

        // Then
        Account foundAccount = accountRepo.findByEmail("initialEmail@initial.com").orElse(null);
        assertNotNull(foundAccount);
        assertNull(foundAccount.getResetToken());
    }
}