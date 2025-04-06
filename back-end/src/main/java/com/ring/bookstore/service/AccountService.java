package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.model.dto.response.dashboard.ChartDTO;
import com.ring.bookstore.model.dto.response.accounts.AccountDTO;
import com.ring.bookstore.model.dto.response.dashboard.StatDTO;
import com.ring.bookstore.model.enums.UserRole;
import org.springframework.data.domain.Page;

import com.ring.bookstore.model.dto.response.accounts.AccountDetailDTO;
import com.ring.bookstore.model.dto.response.accounts.ProfileDTO;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.AccountProfile;
import com.ring.bookstore.model.dto.request.AccountRequest;
import com.ring.bookstore.model.dto.request.ChangePassRequest;
import com.ring.bookstore.model.dto.request.ProfileRequest;
import org.springframework.web.multipart.MultipartFile;

public interface AccountService {

    Page<AccountDTO> getAllAccounts(Integer pageNo,
                                    Integer pageSize,
                                    String sortBy,
                                    String sortDir,
                                    String keyword,
                                    UserRole role);

    AccountDetailDTO getAccountById(Long id);

    StatDTO getAnalytics();

    Account saveAccount(AccountRequest request,
                        MultipartFile file);
    Account updateAccount(AccountRequest request,
                          MultipartFile file,
                          Long id);

    void deleteAccount(Long id);

    void deleteAccounts(List<Long> ids);

    void deleteAccountsInverse(String keyword,
                              UserRole role,
                              List<Long> ids);

    void deleteAllAccounts();

    ProfileDTO getProfile(Account user);

    AccountProfile updateProfile(ProfileRequest request,
                                 MultipartFile file,
                                 Account user);

    Account changePassword(ChangePassRequest request,
                           Account user);

}
