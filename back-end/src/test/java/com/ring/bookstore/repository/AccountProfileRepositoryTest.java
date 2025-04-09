package com.ring.bookstore.repository;

import com.ring.bookstore.base.AbstractRepositoryTest;
import com.ring.bookstore.model.dto.projection.accounts.IAccountDetail;
import com.ring.bookstore.model.dto.projection.accounts.IProfile;
import com.ring.bookstore.model.entity.*;
import com.ring.bookstore.model.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AccountProfileRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private AccountProfileRepository profileRepo;

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private AddressRepository addressRepo;

    @Autowired
    private ImageRepository imageRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Test
    public void givenNewProfile_whenSaveProfile_ThenReturnProfile() {

        // Given
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .build();
        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .build();

        // When
        AccountProfile savedProfile = profileRepo.save(profile);

        // Then
        assertNotNull(savedProfile);
        assertNotNull(savedProfile.getId());
    }

    @Test
    public void whenUpdateProfile_ThenReturnProfile() {

        // Given
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

        // When
        foundProfile.setName("new name");
        foundProfile.setPhone("01234");

        AccountProfile updatedProfile = profileRepo.save(foundProfile);

        // Then
        assertNotNull(updatedProfile);
        assertNotNull(updatedProfile.getPhone());
        assertEquals("new name", updatedProfile.getName());
    }

    @Test
    public void whenDeleteProfile_ThenFindNull() {

        // Given
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
        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .image(image)
                .address(address)
                .addresses(List.of(address))
                .build();
        profileRepo.save(profile);

        // When
        profileRepo.deleteById(profile.getId());

        // Then
        AccountProfile foundProfile = profileRepo.findById(profile.getId()).orElse(null);
        Account foundAccount = accountRepo.findById(account.getId()).orElse(null);
        Image foundImage = imageRepo.findById(image.getId()).orElse(null);
        Address foundAddress = addressRepo.findById(address.getId()).orElse(null);

        assertNull(foundProfile);
        assertNull(foundImage);
        assertNull(foundAddress);
        assertNotNull(foundAccount);
    }

    @Test
    public void whenFindProfileByUser_ThenReturnResultWithSameEmail() {

        // Given
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

        // When
        IProfile profileProjection = profileRepo.findProfileByUser(savedProfile.getUser().getId()).orElse(null);

        // Then
        assertNotNull(profileProjection);
        assertEquals(account.getEmail(), profileProjection.getEmail());
    }

    @Test
    public void whenFindDetailAccount_ThenReturnResultWithSameId() {

        // Given
        Role role = Role.builder().roleName(UserRole.ROLE_ADMIN).build();
        roleRepo.save(role);
        Account account = Account.builder()
                .username("username")
                .pass("asd")
                .email("email")
                .roles(List.of(role))
                .build();
        account.setCreatedDate(LocalDateTime.now());
        AccountProfile profile = AccountProfile.builder()
                .dob(LocalDate.now())
                .user(account)
                .build();

        AccountProfile savedProfile = profileRepo.save(profile);

        // When
        IAccountDetail detailProjection = profileRepo.findDetailById(savedProfile.getUser().getId()).orElse(null);

        // Then
        assertNotNull(detailProjection);
        assertEquals(account.getId(), detailProjection.getId());
    }
}