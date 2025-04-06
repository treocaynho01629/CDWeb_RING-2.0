package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.response.accounts.IAccountDetail;
import com.ring.bookstore.model.dto.response.accounts.IProfile;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.AccountProfile;
import com.ring.bookstore.model.entity.Address;
import com.ring.bookstore.model.entity.Image;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AccountProfileRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private AccountProfileRepository profileRepo;

    @Autowired
    private AddressRepository addressRepo;

    @Autowired
    private ImageRepository imageRepo;

    @Test
    public void givenNewProfile_whenSaveProfile_ThenReturnProfile() {
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();
        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .build();

        AccountProfile savedProfile = profileRepo.save(profile);

        assertNotNull(savedProfile);
        assertNotNull(savedProfile.getId());
    }

    @Test
    public void whenUpdateProfile_ThenReturnProfile() {
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();
        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .build();

        profileRepo.save(profile);

        AccountProfile foundProfile = profileRepo.findById(profile.getId()).orElse(null);
        assertNotNull(foundProfile);
        foundProfile.setName("new name");
        foundProfile.setPhone("01234");

        AccountProfile updatedProfile = profileRepo.save(foundProfile);

        assertNotNull(updatedProfile);
        assertNotNull(updatedProfile.getPhone());
        assertEquals("new name", updatedProfile.getName());
    }

    @Test
    public void whenDeleteProfile_ThenFindNull() {
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();
        account.setCreatedDate(LocalDateTime.now());
        Image image = Image.builder().build();
        Address address = Address.builder()
                .address("123/abc/j12")
                .build();
        Address address2 = Address.builder()
                .address("321/abc/j12")
                .build();
        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .image(image)
                .address(address)
                .addresses(List.of(address2))
                .build();

        profileRepo.save(profile);

        profileRepo.deleteById(profile.getId());

        AccountProfile foundProfile = profileRepo.findById(profile.getId()).orElse(null);
        Image foundImage = imageRepo.findById(image.getId()).orElse(null);
        List<Address> foundAddresses = addressRepo.findAllById(List.of(address.getId(), address2.getId()));

        assertNull(foundProfile);
        assertNull(foundImage);
        assertTrue(foundAddresses.isEmpty());
    }

    @Test
    public void whenFindProfileByUser_ThenReturnResultWithSameEmail() {
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

        AccountProfile savedProfile = profileRepo.save(profile);

        IProfile profileProjection = profileRepo.findProfileByUser(savedProfile.getUser().getId()).orElse(null);

        assertNotNull(profileProjection);
        assertEquals(account.getEmail(), profileProjection.getEmail());
    }

    @Test
    public void whenFindDetailAccount_ThenReturnResultWithSameId() {
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

        AccountProfile savedProfile = profileRepo.save(profile);

        IAccountDetail detailProjection = profileRepo.findDetailById(savedProfile.getUser().getId()).orElse(null);

        assertNotNull(detailProjection);
        assertEquals(account.getId(), detailProjection.getId());
    }
}