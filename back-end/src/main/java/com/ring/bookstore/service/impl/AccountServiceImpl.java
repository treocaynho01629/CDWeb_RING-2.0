package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.accounts.*;
import com.ring.bookstore.dtos.ChartDTO;
import com.ring.bookstore.dtos.mappers.AccountMapper;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.model.Image;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.repository.AccountProfileRepository;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.request.AccountRequest;
import com.ring.bookstore.request.ChangePassRequest;
import com.ring.bookstore.request.ProfileRequest;
import com.ring.bookstore.service.AccountService;
import com.ring.bookstore.service.ImageService;
import com.ring.bookstore.service.RoleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepo;
    private final AccountProfileRepository profileRepo;

    private final RoleService roleService;
    private final ImageService imageService;

    private final AccountMapper accountMapper;
    private final PasswordEncoder passwordEncoder;

    //Get all accounts
    public Page<AccountDTO> getAllAccounts(Integer pageNo,
                                           Integer pageSize,
                                           String sortBy,
                                           String sortDir,
                                           String keyword,
                                           Short roles) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());
        Page<IAccount> accountsList = accountRepo.findAccountsWithFilter(keyword, roles, pageable);
        return accountsList.map(accountMapper::projectionToDTO);
    }

    //Get account by {id}
    public AccountDetailDTO getAccountById(Long id) {
        Account account = accountRepo.findById(id).orElseThrow(()
                -> new ResourceNotFoundException("User not found!"));
        return accountMapper.accountToDetailDTO(account);
    }

    //Create account (ADMIN)
    @Transactional
    public Account saveAccount(AccountRequest request) {

        //Check if Account with these username and email has exists >> throw exception
        if (!accountRepo.findByUsername(request.getUsername()).isEmpty()) {
            throw new HttpResponseException(
                    HttpStatus.CONFLICT,
                    "User already existed!",
                    "Người dùng với tên đăng nhập này đã tồn tại!"
            );
        }

        //Set roles: 1 USER, 2 SELLER, 3 ADMIN
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(
                () -> new ResourceNotFoundException("No roles has been set!")));

        if (request.getRoles() >= 2) {
            roles.add(roleService.findByRoleName(RoleName.ROLE_SELLER).orElseThrow(
                    () -> new ResourceNotFoundException("Role not found!")));
        } else if (request.getRoles() >= 3) {
            roles.add(roleService.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow(
                    () -> new ResourceNotFoundException("Role not found!")));
        }

        //Create account
        var acc = Account.builder()
                .username(request.getUsername())
                .pass(passwordEncoder.encode(request.getPass()))
                .email(request.getEmail())
                .roles(roles)
                .build();

        Account savedAccount = accountRepo.save(acc); //Save to Database

        //Create their profile
        var profile = AccountProfile.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .dob(request.getDob())
                .gender(request.getGender())
                .user(savedAccount)
                .build();

        profileRepo.save(profile); //Save profile to Database
        return savedAccount; //Return created account
    }

    //Update account (ADMIN)
    @Transactional
    public Account updateAccount(AccountRequest request, Long id) {
        //Check Account exists?
        Account currUser = accountRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        //Check if Account with these username and email has exists >> throw exception
        if (!request.getUsername().equals(currUser.getUsername()) && !accountRepo.findByUsername(request.getUsername()).isEmpty()) {
            throw new HttpResponseException(
                    HttpStatus.CONFLICT,
                    "User already existed!",
                    "Người dùng với tên đăng nhập này đã tồn tại!"
            );
        }

        //Set roles: 1 USER, 2 SELLER, 3 ADMIN
        Set<Role> roles = new HashSet<>();
        roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(
                () -> new ResourceNotFoundException("No roles has been set!")));

        if (request.getRoles() >= 2) {
            roles.add(roleService.findByRoleName(RoleName.ROLE_SELLER).orElseThrow(
                    () -> new ResourceNotFoundException("Role not found!")));
        }
        if (request.getRoles() >= 3) {
            roles.add(roleService.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow(
                    () -> new ResourceNotFoundException("Role not found!")));
        }

        //Set new info
        currUser.setUsername(request.getUsername());
        currUser.setEmail(request.getEmail());
        currUser.setRoles(roles);
        if (!request.isKeepOldPass()) currUser.setPass(passwordEncoder.encode(request.getPass()));

        Account updatedAccount = accountRepo.save(currUser); //Save to Database

        //Get current profile
        AccountProfile profile = updatedAccount.getProfile();

        //Set new profile info
        profile.setName(request.getName());
        profile.setPhone(request.getPhone());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());

        profileRepo.save(profile); //Save profile to Database
        return updatedAccount; //Return updated account
    }

    //Delete account (ADMIN)
    @Transactional
    public void deleteAccount(Long id) {
        //Check if account exists?
        Account account = accountRepo.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User not found!"));

        //Remove relationship with related Table
        account.removeAllOrders();
        account.removeAllReviews();
        account.removeAllRoles();

        Account savedAccount = accountRepo.save(account); //Firstly save to database
        accountRepo.delete(savedAccount); //Delete from database
    }

    //Delete multiples accounts (ADMIN)
    @Transactional
    public void deleteAccounts(List<Long> ids) {
        //Loop through and delete from lists
        for (Long id : ids) {
            Account account = accountRepo.findById(id).orElseThrow(
                    () -> new ResourceNotFoundException("User not found!"));

            //Remove relationship
            account.removeAllOrders();
            account.removeAllReviews();
            account.removeAllRoles();

            accountRepo.deleteById(id); //Delete from database
        }
    }

    //Delete all accounts (ADMIN)
    @Transactional
    public void deleteAllAccounts() {
        accountRepo.deleteAll();
    }

    //Get account's profile
    public ProfileDTO getProfile(Account user) {
        IProfile currProfile = profileRepo.findProfileByUser(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found!"));
        return accountMapper.projectionToProfileDTO(currProfile);
    }

    //Update account's profile
    @Transactional
    public AccountProfile updateProfile(ProfileRequest request, MultipartFile file, Account user) throws IOException, ImageResizerException {
        AccountProfile profile = profileRepo.findById(user.getProfile().getId()).orElseThrow(()
            -> new ResourceNotFoundException("Profile not found!"));

        //Image upload/replace
        if (file != null) { //Contain new image >> upload/replace
            if (profile.getImage() != null) imageService.deleteImage(profile.getImage().getId()); //Delete old image
            Image savedImage = imageService.upload(file); //Upload new image
            profile.setImage(savedImage); //Set new image
        } else if (request.getImage() == null) { //Remove image
            if (profile.getImage() != null) imageService.deleteImage(profile.getImage().getId()); //Delete old image
            profile.setImage(null);
        }

        //Set info
        profile.setName(request.getName());
        profile.setPhone(request.getPhone());
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
            throw new HttpResponseException(
                    HttpStatus.BAD_REQUEST,
                    "Password not correct!",
                    "Mật khẩu hiện tại không đúng!"
            );
        //Check matching new password
        if (!request.getNewPass().equals(request.getNewPassRe()))
            throw new HttpResponseException(
                    HttpStatus.BAD_REQUEST,
                    "Re input password does not match!",
                    "Mật khẩu không trùng khớp!"
            );

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
//        emailService.sendTemplateMail(user.getEmail(), subject, content);

        return savedAccount; //Return updated account
    }

    //Get top users FIX
    public List<ChartDTO> getTopAccount() {
//        List<Map<String,Object>> result = accountRepo.getTopUser();
//        return result.stream().map(chartMapper::apply).collect(Collectors.toList()); //Return chart data
        return null;
    }

    //Get top sellers
    public List<ChartDTO> getTopSeller() {
//        List<Map<String,Object>> result = accountRepo.getTopSeller();
//        return result.stream().map(chartMapper::apply).collect(Collectors.toList()); //Return chart data
        return null;
    }
}
