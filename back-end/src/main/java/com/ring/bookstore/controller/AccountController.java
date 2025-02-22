package com.ring.bookstore.controller;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.dtos.accounts.AccountDTO;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.ImageResizerException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.dtos.accounts.AccountDetailDTO;
import com.ring.bookstore.dtos.accounts.ProfileDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.request.AccountRequest;
import com.ring.bookstore.request.ChangePassRequest;
import com.ring.bookstore.request.ProfileRequest;
import com.ring.bookstore.service.AccountService;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Validated
public class AccountController {

    private final AccountService accountService;

    //Get all accounts
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getAllAccounts(@RequestParam(value = "pSize", defaultValue = "10") Integer pageSize,
                                            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
                                            @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                            @RequestParam(value = "role", required = false) RoleName role
    ) {
        Page<AccountDTO> accounts = accountService.getAllAccounts(pageNo, pageSize, sortBy, sortDir, keyword, role);
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    //Get account by {id}
    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getAccountById(@PathVariable("id") Long accountId) {
        return new ResponseEntity<>(accountService.getAccountById(accountId), HttpStatus.OK);
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getAccountAnalytics() {
        return new ResponseEntity<>(accountService.getAnalytics(), HttpStatus.OK);
    }

    //Create new account through Admin dashboard
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<Account> saveAccount(@Valid @RequestPart AccountRequest request,
                                               @RequestPart(name = "image", required = false) MultipartFile file) throws ImageResizerException, IOException {
        return new ResponseEntity<>(accountService.saveAccount(request, file), HttpStatus.CREATED);
    }

    //Edit account by {id}
    @PutMapping(value = "{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<Account> updateAccount(@PathVariable("id") Long accountId,
                                                 @Valid @RequestPart AccountRequest request,
                                                 @RequestPart(name = "image", required = false) MultipartFile file) throws ImageResizerException, IOException {
        return new ResponseEntity<>(accountService.updateAccount(request, file, accountId), HttpStatus.OK);
    }

    //Delete account by {id}
    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<String> deleteAccount(@PathVariable("id") Long accountId) {
        accountService.deleteAccount(accountId);
        return new ResponseEntity<>("Account deleted successfully!", HttpStatus.OK);
    }

    //Delete multiple accounts from a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAccounts(@RequestParam("ids") List<Long> ids) {
        accountService.deleteAccounts(ids);
        return new ResponseEntity<>("Accounts deleted successfully!", HttpStatus.OK);
    }

    //Delete multiple accounts not in lists of {ids}
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAccountsInverse(@RequestParam(value = "keyword", defaultValue = "") String keyword,
                                                   @RequestParam(value = "role", required = false) RoleName role,
                                                   @RequestParam("ids") List<Long> ids) {
        accountService.deleteAccountsInverse(keyword, role, ids);
        return new ResponseEntity<>("Accounts deleted successfully!", HttpStatus.OK);
    }

    //Delete all accounts
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAllAccounts() {
        accountService.deleteAllAccounts();
        return new ResponseEntity<>("All accounts deleted successfully!", HttpStatus.OK);
    }

    //Get account's profile (AccountProfile)
    @GetMapping("/profile")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<ProfileDTO> getProfile(@CurrentAccount Account currUser) {
        ProfileDTO profile = accountService.getProfile(currUser);
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }

    //Update account's profile
    @PutMapping(value = "/profile", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAnyRole('USER','SELLER','ADMIN')")
    public ResponseEntity<AccountProfile> updateProfile(@Valid @RequestPart ProfileRequest request,
                                                        @RequestPart(name = "image", required = false) MultipartFile file,
                                                        @CurrentAccount Account currUser) throws ImageResizerException, IOException {
        AccountProfile profile = accountService.updateProfile(request, file, currUser);
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }

    //Change account's password
    @PutMapping("/change-password")
    @PreAuthorize("hasAnyRole('USER','SELLER','ADMIN')")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePassRequest request, @CurrentAccount Account currUser) {
        Account account = accountService.changePassword(request, currUser);
        String result = "Đổi mật khẩu thất bại";
        if (account != null) result = "Thay đổi mật khẩu thành công!";
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    //Get accounts chart (User)
    @GetMapping("/top-accounts")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getTopAccounts() {
        return new ResponseEntity<>(accountService.getTopAccount(), HttpStatus.OK);
    }

    //Get sellers chart
    @GetMapping("/top-sellers")
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getTopSellers() {
        return new ResponseEntity<>(accountService.getTopSeller(), HttpStatus.OK);
    }
}
