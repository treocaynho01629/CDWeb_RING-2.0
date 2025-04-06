package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.response.accounts.IAddress;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.AccountProfile;
import com.ring.bookstore.model.entity.Address;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AddressRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private AddressRepository addressRepo;

    @Autowired
    private AccountProfileRepository profileRepo;

    @Test
    public void givenNewAddress_whenSaveAddress_ThenReturnAddress() {
        Address address = Address.builder()
                .address("123/abc/j12")
                .build();

        Address savedAddress = addressRepo.save(address);

        assertNotNull(savedAddress);
        assertNotNull(savedAddress.getId());
    }

    @Test
    public void whenUpdateProfile_ThenReturnProfile() {
        Address address = Address.builder()
                .address("123/abc/j12")
                .build();

        addressRepo.save(address);

        Address foundAddress = addressRepo.findById(address.getId()).orElse(null);
        assertNotNull(foundAddress);
        foundAddress.setCity("city");
        foundAddress.setName("test");
        foundAddress.setIsDefault(true);

        Address updatedAddress = addressRepo.save(foundAddress);

        assertNotNull(updatedAddress);
        assertNotNull(updatedAddress.getCity());
        assertTrue(updatedAddress.getIsDefault());
        assertEquals("test", updatedAddress.getName());
    }

    @Test
    public void whenDeleteProfile_ThenFindNull() {
        Address address = Address.builder()
                .address("123/abc/j12")
                .build();

        addressRepo.save(address);

        addressRepo.deleteById(address.getId());

        Address foundAddress = addressRepo.findById(address.getId()).orElse(null);

        assertNull(foundAddress);
    }

    @Test
    public void whenFindAddressesByProfile_ThenReturnAddressList() {
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .build();
        Address address1 = Address.builder()
                .profile(profile)
                .address("Street 1")
                .city("City 1")
                .build();
        Address address2 = Address.builder()
                .profile(profile)
                .address("Street 2")
                .city("City 2")
                .build();

        profileRepo.save(profile);
        addressRepo.saveAll(List.of(address1, address2));

        List<IAddress> foundAddresses = addressRepo.findAddressesByProfile(profile.getId());

        assertNotNull(foundAddresses);
        assertFalse(foundAddresses.isEmpty());
    }

    @Test
    public void whenFindAddressByProfile_ThenReturnAddress() {
        Address address = Address.builder()
                .address("Main Street")
                .city("Main City")
                .build();
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .address(address)
                .build();

        profileRepo.save(profile);

        IAddress foundAddress = addressRepo.findAddressByProfile(profile.getId());

        assertNotNull(foundAddress);
    }

}