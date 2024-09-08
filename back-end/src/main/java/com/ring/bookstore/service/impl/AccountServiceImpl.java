package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.AccountDetailDTO;
import com.ring.bookstore.dtos.ChartDTO;
import com.ring.bookstore.dtos.ProfileDTO;
import com.ring.bookstore.dtos.mappers.AccountDetailMapper;
import com.ring.bookstore.dtos.mappers.ChartDataMapper;
import com.ring.bookstore.dtos.mappers.ProfileMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.repository.AccountProfileRepository;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.request.AccountRequest;
import com.ring.bookstore.request.ChangePassRequest;
import com.ring.bookstore.request.ProfileRequest;
import com.ring.bookstore.service.AccountService;
import com.ring.bookstore.service.EmailService;
import com.ring.bookstore.service.RoleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepo;
    private final AccountProfileRepository profileRepo;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final EmailService emailService;
    private final ProfileMapper profileMapper;
    private final AccountDetailMapper detailMapper;
    private final ChartDataMapper chartMapper;

    //Get all accounts
    public Page<Account> getAllAccounts(Integer pageNo, Integer pageSize, String sortBy, String sortDir,
                Boolean isEmployees, String keyword, Integer role) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        //Filter by role/employees
        int maxRoles = role != null ? role : RoleName.values().length + 1; //+ 1 to prevent role = 3 (ADMIN)
        int minRoles = (maxRoles < RoleName.values().length + 1) ? maxRoles - 1 : (isEmployees ? 1 : 0);
        return accountRepo.findAccountsWithFilter(keyword, maxRoles, minRoles, pageable); //Pagination
    }

    //Get account by {id}
    public AccountDetailDTO getAccountById(Integer id) {
        Account account = accountRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("User does not exists!"));
        return detailMapper.apply(account);
    }

    //Create account (ADMIN)
    public Account saveAccount(AccountRequest request) {

        //Check if Account with these username and email has exists >> throw exception
        if (!accountRepo.findByUserName(request.getUserName()).isEmpty()) {
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
        }

        //Set roles: 1 USER, 2 SELLER, 3 ADMIN
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));

        if (request.getRoles() >= 2) {
            roles.add(roleService.findByRoleName(RoleName.ROLE_SELLER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
        } else if (request.getRoles() >= 3) {
            roles.add(roleService.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
        }

        //Create account
        var acc = Account.builder()
                .userName(request.getUserName())
                .pass(passwordEncoder.encode(request.getPass()))
                .email(request.getEmail())
                .roles(roles)
                .build();

        Account savedAccount = accountRepo.save(acc); //Save to Database

        //Create their profile
        var profile = AccountProfile.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .dob(request.getDob())
                .gender(request.getGender())
                .user(savedAccount)
                .build();

        profileRepo.save(profile); //Save profile to Database
        return savedAccount; //Return created account
    }

    //Update account (ADMIN)
    public Account updateAccount(AccountRequest request, Integer id) {
        //Check Account exists?
        Account currUser = accountRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User does not exist!"));

        //Check if Account with these username and email has exists >> throw exception
        if (!request.getUserName().equals(currUser.getUsername()) && !accountRepo.findByUserName(request.getUserName()).isEmpty()) {
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
        }

        //Set roles: 1 USER, 2 SELLER, 3 ADMIN
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));

        if (request.getRoles() >= 2) {
            roles.add(roleService.findByRoleName(RoleName.ROLE_SELLER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
        }
        if (request.getRoles() >= 3) {
            roles.add(roleService.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
        }

        //Set new info
        currUser.setUserName(request.getUserName());
        currUser.setEmail(request.getEmail());
        currUser.setRoles(roles);
        if (!request.isKeepOldPass()) currUser.setPass(passwordEncoder.encode(request.getPass()));

        Account updatedAccount = accountRepo.save(currUser); //Save to Database

        //Get current profile
        AccountProfile profile = updatedAccount.getProfile();

        //Create one if not exist
        if (profile == null) {
            profile = new AccountProfile();
            profile.setUser(updatedAccount);
        }

        //Set new profile info
        profile.setName(request.getName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());

        profileRepo.save(profile); //Save profile to Database
        return updatedAccount; //Return updated account
    }

    //Delete account (ADMIN)
    public void deleteAccount(Integer id) {
        //Check if account exists?
        Account account = accountRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User does not exist!"));

        //Remove relationship with related Table
        account.removeAllOrders();
        account.removeAllBooks();
        account.removeAllReviews();
        account.removeAllRoles();

        Account savedAccount = accountRepo.save(account); //Firstly save to database
        accountRepo.delete(savedAccount); //Delete from database
    }

    //Delete multiples accounts (ADMIN)
    @Transactional
    public void deleteAccounts(List<Integer> ids) {
        //Loop through and delete from lists
        for (Integer id : ids) {
            Account account = accountRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User does not exist!"));

            //Remove relationship
            account.removeAllOrders();
            account.removeAllBooks();
            account.removeAllReviews();
            account.removeAllRoles();

            accountRepo.deleteById(id); //Delete from database
        }
    }

    //Delete all accounts (ADMIN)
    @Transactional
    public void deleteAllAccounts() {
        for (Account account : accountRepo.findAll()) {
            //Remove relationship
            account.removeAllOrders();
            account.removeAllBooks();
            account.removeAllReviews();
            account.removeAllRoles();
        }

        accountRepo.deleteAll(); //Delete all
    }

    //Get account's profile
    public ProfileDTO getProfile(Account user) {
        return profileMapper.apply(user);
    }

    //Update account's profile
    @Override
    public AccountProfile updateProfile(ProfileRequest request, Account user) {
        AccountProfile profile = user.getProfile();

        //Create one if not exists
        if (profile == null) {
            profile = new AccountProfile();
            profile.setUser(user);
        }

        //Set info
        profile.setName(request.getName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());

        AccountProfile updatedProfile = profileRepo.save(profile); //Save to Database
        return updatedProfile;
    }

    //Change password
    @Override
    public Account changePassword(ChangePassRequest request, Account user) {
        //Check current password
        if (!passwordEncoder.matches(request.getPass(), user.getPass()))
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không đúng!");
        //Check matching new password
        if (!request.getNewPass().equals(request.getNewPassRe()))
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Mật khẩu không trùng khớp!");

        //Change password and save to database
        user.setPass(passwordEncoder.encode(request.getNewPass()));
        Account savedAccount = accountRepo.save(user);

        //Create and send an email
        String subject = "RING! - BOOKSTORE: Đổi mật khẩu thành công! ";
        String content = "<h1><b style=\"color: #63e399;\">RING!</b> - BOOKSTORE</h1>\n"
                + "<h2 style=\"background-color: #63e399; padding: 10px; color: white;\" >\r\n"
                + "Tài khoản của bạn đã được đổi mật khẩu thành công!\r\n"
                + "</h2>\n"
                + "<h3>Tài khoản RING!:</h3>\n"
                + "<p><b>- Tên đăng nhập: </b>" + user.getUsername() + " đã đổi mật khẩu thành công</p>\n"
                + "<p>- Chúc bạn có trả nghiệm vui vẻ khi mua sách tại RING! - BOOKSTORE</p>\n"
                + "<br><p>Không phải bạn thực hiện thay đổi trên? Liên hệ và yêu cầu xử lý tại: <b>ringbookstore@ring.email</b></p>\n"
                + "<br><br><h3>Cảm ơn đã sử dụng dịch vụ!</h3>\n";
        emailService.sendHtmlMessage(user.getEmail(), subject, content);

        return savedAccount; //Return updated account
    }

    //Get top users
    public List<ChartDTO> getTopAccount() {
        List<Map<String,Object>> result = accountRepo.getTopUser();
        return result.stream().map(chartMapper::apply).collect(Collectors.toList()); //Return chart data
    }

    //Get top sellers
    public List<ChartDTO> getTopSeller() {
        List<Map<String,Object>> result = accountRepo.getTopSeller();
        return result.stream().map(chartMapper::apply).collect(Collectors.toList()); //Return chart data
    }
}
