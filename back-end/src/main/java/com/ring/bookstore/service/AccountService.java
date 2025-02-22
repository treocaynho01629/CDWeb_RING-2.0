package com.ring.bookstore.service;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.dtos.dashboard.ChartDTO;
import com.ring.bookstore.dtos.accounts.AccountDTO;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.data.domain.Page;

import com.ring.bookstore.dtos.accounts.AccountDetailDTO;
import com.ring.bookstore.dtos.accounts.ProfileDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.request.AccountRequest;
import com.ring.bookstore.request.ChangePassRequest;
import com.ring.bookstore.request.ProfileRequest;
import org.springframework.web.multipart.MultipartFile;

public interface AccountService {

    Page<AccountDTO> getAllAccounts(Integer pageNo,
                                    Integer pageSize,
                                    String sortBy,
                                    String sortDir,
                                    String keyword,
                                    RoleName role);

    AccountDetailDTO getAccountById(Long id);

    StatDTO getAnalytics();

    Account saveAccount(AccountRequest request,
                        MultipartFile file) throws IOException, ImageResizerException;

    Account updateAccount(AccountRequest request,
                          MultipartFile file,
                          Long id) throws IOException, ImageResizerException;

    void deleteAccount(Long id);

    void deleteAccounts(List<Long> ids);

    void deleteAccountsInverse(String keyword,
                              RoleName role,
                              List<Long> ids);

    void deleteAllAccounts();

    ProfileDTO getProfile(Account user);

    AccountProfile updateProfile(ProfileRequest request,
                                 MultipartFile file,
                                 Account user) throws IOException, ImageResizerException;

    Account changePassword(ChangePassRequest request,
                           Account user);

    List<ChartDTO> getTopAccount();

    List<ChartDTO> getTopSeller();
}
