package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.accounts.IAccount;
import com.ring.bookstore.dtos.dashboard.IStat;
import com.ring.bookstore.enums.PrivilegeName;
import com.ring.bookstore.enums.UserRole;
import com.ring.bookstore.model.*;
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
class AccountRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PrivilegeRepository privilegeRepo;

    @Autowired
    private RefreshTokenRepository tokenRepo;

    @PersistenceContext
    private EntityManager entityManager;

    @BeforeEach
    void setUp() {
        Privilege privilege = Privilege.builder().privilegeName(PrivilegeName.READ_PRIVILEGE).build();
        Privilege savedPrivilege = privilegeRepo.save(privilege);
        Role newRole = Role.builder().roleName(UserRole.ROLE_GUEST).privileges(List.of(savedPrivilege)).build();
        Role savedRole = roleRepo.save(newRole);

        Account account = Account.builder()
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

        RefreshToken token = RefreshToken.builder()
                .refreshToken("test")
                .user(account)
                .build();
        tokenRepo.save(token);
    }

    @Test
    public void givenNewAccount_whenSaveAccount_ThenReturnAccount() {
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();

        Account savedProfile = accountRepo.save(account);

        assertNotNull(savedProfile);
        assertNotNull(savedProfile.getId());
    }

    @Test
    public void whenUpdateAccount_ThenReturnAccount() {
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();

        Account savedProfile = accountRepo.save(account);

        Account foundAccount = accountRepo.findById(savedProfile.getId()).orElse(null);

        assertNotNull(foundAccount);
        foundAccount.setUsername("nameuser");
        foundAccount.setEmail("change@example.com");

        Account updatedAccount = accountRepo.save(foundAccount);

        assertNotNull(updatedAccount);
        assertEquals("nameuser", updatedAccount.getUsername());
        assertEquals("change@example.com", updatedAccount.getEmail());
    }

    @Test
    public void whenDeleteAccount_ThenFindNull() {
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();

        Account savedAccount = accountRepo.save(account);

        accountRepo.deleteById(savedAccount.getId());

        Account foundAccount = accountRepo.findById(savedAccount.getId()).orElse(null);

        assertNull(foundAccount);
    }

    @Test
    public void whenFindByUsername_ThenReturnAccount() {
        Account foundAccount = accountRepo.findByUsername("initial").orElse(null);
        assertNotNull(foundAccount);
        assertEquals("initial", foundAccount.getUsername());
    }

    @Test
    public void whenFindByRefreshTokenAndUsername_ThenReturnAccount() {
        Account foundAccount = accountRepo.findByRefreshTokenAndUsername("test", "initial").orElse(null);
        assertNotNull(foundAccount);
    }

    @Test
    public void whenFindByResetToken_ThenReturnAccount() {
        Account foundAccount = accountRepo.findByResetToken("reset321").orElse(null);
        assertNotNull(foundAccount);
    }

    @Test
    public void whenFindAccountsWithFilter_ThenReturnTheRightListSize() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IAccount> accountsList = accountRepo.findAccountsWithFilter("test", null, pageable);

        assertNotNull(accountsList);
        assertEquals(2, accountsList.getContent().size());
    }

    @Test
    public void whenFindInverseIds_ThenReturnCorrectSize() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<IAccount> foundAccounts = accountRepo.findAccountsWithFilter("test", null, pageable);
        List<Long> foundIds = foundAccounts.getContent().stream().map(IAccount::getId).collect(Collectors.toList());
        foundIds.remove(0);
        List<Long> inverseIds = accountRepo.findInverseIds("test", null, foundIds);

        assertNotNull(inverseIds);
        assertEquals(foundAccounts.getTotalElements() - foundIds.size(), inverseIds.size());
    }

    @Test
    public void whenGetAccountAnalytics_ThenReturnStats() {
        IStat foundData = accountRepo.getAccountAnalytics();

        assertNotNull(foundData);
        assertEquals(2, foundData.getLastMonth());
        assertEquals(1, foundData.getCurrentMonth());
    }

    @Test
    public void whenClearResetToken_ThenResetTokenIsNull() {
        accountRepo.clearResetToken("reset123");
        entityManager.flush(); // Force changes to be written
        entityManager.clear(); // Clear persistence context to fetch fresh data

        Account foundAccount = accountRepo.findByEmail("initialEmail@initial.com").orElse(null);
        assertNotNull(foundAccount);
        assertNull(foundAccount.getResetToken());
    }
}