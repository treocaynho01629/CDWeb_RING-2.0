package com.ring.bookstore.controller;

import java.util.List;

import com.ring.bookstore.model.dto.response.accounts.AccountDTO;
import com.ring.bookstore.model.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.dto.response.accounts.ProfileDTO;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.AccountProfile;
import com.ring.bookstore.model.dto.request.AccountRequest;
import com.ring.bookstore.model.dto.request.ChangePassRequest;
import com.ring.bookstore.model.dto.request.ProfileRequest;
import com.ring.bookstore.service.AccountService;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controller named {@link AccountController} for handling user-related operations.
 * Exposes endpoints under "/api/accounts".
 */
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Validated
public class AccountController {

    private final AccountService accountService;

    /**
     * Retrieves all accounts with pagination and filtering options.
     *
     * @param pageSize size of each page.
     * @param pageNo   page number.
     * @param sortBy   sorting field.
     * @param sortDir  sorting direction.
     * @param keyword  a search keyword to filter accounts (default is an empty string).
     * @param role     the role to filter accounts (optional).
     * @return a {@link ResponseEntity} containing a list of accounts wrapped in a {@link Page} object.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('read:user')")
    public ResponseEntity<?> getAllAccounts(@RequestParam(value = "pSize", defaultValue = "10") Integer pageSize,
                                            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
                                            @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                            @RequestParam(value = "role", required = false) UserRole role
    ) {
        Page<AccountDTO> accounts = accountService.getAllAccounts(pageNo, pageSize, sortBy, sortDir, keyword, role);
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    /**
     * Retrieves an account by its ID.
     *
     * @param accountId the ID of the account to retrieve.
     * @return a {@link ResponseEntity} containing the account details.
     */
    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('read:user')")
    public ResponseEntity<?> getAccountById(@PathVariable("id") Long accountId) {
        return new ResponseEntity<>(accountService.getAccountById(accountId), HttpStatus.OK);
    }

    /**
     * Retrieves account analytics.
     *
     * @return a {@link ResponseEntity} containing account analytics data.
     */
    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('read:user')")
    public ResponseEntity<?> getAccountAnalytics() {
        return new ResponseEntity<>(accountService.getAnalytics(), HttpStatus.OK);
    }

    /**
     * Creates a new account through the Admin dashboard.
     *
     * @param request the account creation details.
     * @param file    an optional profile image.
     * @return a {@link ResponseEntity} containing the created account.
     */
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('create:user')")
    public ResponseEntity<Account> saveAccount(@Valid @RequestPart AccountRequest request,
                                               @RequestPart(name = "image", required = false) MultipartFile file) {
        return new ResponseEntity<>(accountService.saveAccount(request, file), HttpStatus.CREATED);
    }

    /**
     * Updates an existing account by its ID.
     *
     * @param accountId the ID of the account to update.
     * @param request   the account update details.
     * @param file      an optional profile image.
     * @param currUser  the current authenticated admin
     * @return a {@link ResponseEntity} containing the updated account.
     */
    @PutMapping(value = "{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('update:user')")
    public ResponseEntity<Account> updateAccount(@PathVariable("id") Long accountId,
                                                 @Valid @RequestPart AccountRequest request,
                                                 @CurrentAccount Account currUser,
                                                 @RequestPart(name = "image", required = false) MultipartFile file) {
        return new ResponseEntity<>(accountService.updateAccount(
                request,
                file,
                currUser,
                accountId), HttpStatus.OK);
    }

    /**
     * Deletes an account by its ID.
     *
     * @param accountId the ID of the account to delete.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:user')")
    public ResponseEntity<String> deleteAccount(@PathVariable("id") Long accountId) {
        accountService.deleteAccount(accountId);
        return new ResponseEntity<>("Account deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes multiple accounts by a list of IDs.
     *
     * @param ids a list of account IDs to delete.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:user')")
    public ResponseEntity<?> deleteAccounts(@RequestParam("ids") List<Long> ids) {
        accountService.deleteAccounts(ids);
        return new ResponseEntity<>("Accounts deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes accounts that are not in the provided list of IDs.
     *
     * @param keyword a search keyword to filter accounts (default is an empty string).
     * @param role    the role to filter accounts (optional).
     * @param ids     a list of account IDs to exclude from deletion.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:user')")
    public ResponseEntity<?> deleteAccountsInverse(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                                   @RequestParam(value = "role", required = false) UserRole role,
                                                   @RequestParam("ids") List<Long> ids) {
        accountService.deleteAccountsInverse(keyword, role, ids);
        return new ResponseEntity<>("Accounts deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes all accounts from the repository.
     *
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:user')")
    public ResponseEntity<?> deleteAllAccounts() {
        accountService.deleteAllAccounts();
        return new ResponseEntity<>("All accounts deleted successfully!", HttpStatus.OK);
    }

    /**
     * Retrieves the profile of the currently authenticated user.
     *
     * @param currUser the currently authenticated user.
     * @return a {@link ResponseEntity} containing the user's profile.
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') and hasAuthority('read:profile')")
    public ResponseEntity<ProfileDTO> getProfile(@CurrentAccount Account currUser) {
        ProfileDTO profile = accountService.getProfile(currUser);
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }

    /**
     * Updates the profile of the currently authenticated user.
     *
     * @param request  the profile update details.
     * @param file     an optional profile image.
     * @param currUser the currently authenticated user.
     * @return a {@link ResponseEntity} containing the updated profile.
     */
    @PutMapping(value = "/profile", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('USER') and hasAuthority('update:profile')")
    public ResponseEntity<AccountProfile> updateProfile(@Valid @RequestPart ProfileRequest request,
                                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                                        @CurrentAccount Account currUser) {
        AccountProfile profile = accountService.updateProfile(request, file, currUser);
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }

    /**
     * Changes the password for the currently authenticated user.
     *
     * @param request  the password change request.
     * @param currUser the currently authenticated user.
     * @return a {@link ResponseEntity} containing a success or failure message.
     */
    @PutMapping("/change-password")
    @PreAuthorize("hasRole('USER') and hasAuthority('update:profile')")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePassRequest request, @CurrentAccount Account currUser) {
        Account account = accountService.changePassword(request, currUser);
        String result = "Đổi mật khẩu thất bại";
        if (account != null) result = "Thay đổi mật khẩu thành công!";
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
