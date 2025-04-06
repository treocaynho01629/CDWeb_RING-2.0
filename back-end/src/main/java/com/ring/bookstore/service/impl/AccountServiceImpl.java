package com.ring.bookstore.service.impl;

import com.ring.bookstore.model.dto.projection.accounts.IAccount;
import com.ring.bookstore.model.dto.projection.accounts.IAccountDetail;
import com.ring.bookstore.model.dto.projection.accounts.IProfile;
import com.ring.bookstore.model.dto.response.accounts.*;
import com.ring.bookstore.model.dto.response.dashboard.StatDTO;
import com.ring.bookstore.model.mappers.AccountMapper;
import com.ring.bookstore.model.mappers.DashboardMapper;
import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.listener.reset.OnResetPasswordCompletedEvent;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.AccountProfile;
import com.ring.bookstore.model.entity.Image;
import com.ring.bookstore.model.entity.Role;
import com.ring.bookstore.repository.AccountProfileRepository;
import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.model.dto.request.AccountRequest;
import com.ring.bookstore.model.dto.request.ChangePassRequest;
import com.ring.bookstore.model.dto.request.ProfileRequest;
import com.ring.bookstore.service.AccountService;
import com.ring.bookstore.service.ImageService;
import com.ring.bookstore.service.RoleService;
import com.ring.bookstore.ultils.FileUploadUtil;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepo;
    private final AccountProfileRepository profileRepo;

    private final RoleService roleService;
    private final ImageService imageService;

    private final AccountMapper accountMapper;
    private final DashboardMapper dashMapper;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    public Page<AccountDTO> getAllAccounts(Integer pageNo,
                                           Integer pageSize,
                                           String sortBy,
                                           String sortDir,
                                           String keyword,
                                           UserRole role) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());
        Page<IAccount> accountsList = accountRepo.findAccountsWithFilter(keyword, role, pageable);
        return accountsList.map(accountMapper::projectionToDTO);
    }

    public AccountDetailDTO getAccountById(Long id) {
        IAccountDetail account = profileRepo.findDetailById(id).orElseThrow(()
                -> new ResourceNotFoundException("User not found!"));
        return accountMapper.projectionToDetailDTO(account);
    }

    public StatDTO getAnalytics() {
        return dashMapper.statToDTO(accountRepo.getAccountAnalytics(),
                "users",
                "Thành viên mới");
    }

    @Transactional
    public Account saveAccount(AccountRequest request, MultipartFile file) {

        //Check if Account with these username and email has exists >> throw exception
        if (accountRepo.existsByUsernameOrEmail(request.getUsername(), request.getEmail())) {
            throw new HttpResponseException(
                    HttpStatus.CONFLICT,
                    "User already existed!",
                    "Người dùng với tên đăng nhập hoặc email này đã tồn tại!"
            );
        }

        //Set role
        Role role = roleService.findByRoleName(request.getRole()).orElseThrow(
                () -> new ResourceNotFoundException("Role not found!"));

        //Create account
        var acc = Account.builder()
                .username(request.getUsername())
                .pass(passwordEncoder.encode(request.getPass()))
                .email(request.getEmail())
                .roles(List.of(role))
                .build();

        Account savedAccount = accountRepo.save(acc); //Save to Database

        //Create profile
        var profile = AccountProfile.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .dob(request.getDob())
                .gender(request.getGender())
                .user(savedAccount)
                .build();

        //Image upload/replace
        profile = this.changeProfilePic(file, request.getImage(), profile);

        profileRepo.save(profile); //Save profile to Database
        return savedAccount; //Return created account
    }

    @Transactional
    public Account updateAccount(AccountRequest request, MultipartFile file, Long id) {
        //Check Account exists?
        Account currUser = accountRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        //Check if Account with these username and email has exists >> throw exception
        if (!request.getUsername().equals(currUser.getUsername())
                && !request.getEmail().equals(currUser.getEmail())
                && accountRepo.existsByUsernameOrEmail(request.getUsername(), request.getEmail())) {
            throw new HttpResponseException(
                    HttpStatus.CONFLICT,
                    "User already existed!",
                    "Người dùng với tên đăng nhập hoặc email này đã tồn tại!"
            );
        }

        // Set role
        Role role = roleService.findByRoleName(request.getRole()).orElseThrow(
                () -> new ResourceNotFoundException("Role not found!"));
        currUser.setRoles(List.of(role));

        //Set new info
        currUser.setUsername(request.getUsername());
        currUser.setEmail(request.getEmail());
        if (!request.isKeepOldPass()) currUser.setPass(passwordEncoder.encode(request.getPass()));

        Account updatedAccount = accountRepo.save(currUser); //Save to Database

        //Get current profile
        AccountProfile profile = updatedAccount.getProfile();

        //Image upload/replace
        profile = this.changeProfilePic(file, request.getImage(), profile);

        //Set new profile info
        profile.setName(request.getName());
        profile.setPhone(request.getPhone());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());

        profileRepo.save(profile); //Save profile to Database
        return updatedAccount; //Return updated account
    }

    @Transactional
    public void deleteAccount(Long id) {
        accountRepo.deleteById(id);
    }

    @Transactional
    public void deleteAccounts(List<Long> ids) {
        accountRepo.deleteAllById(ids);
    }

    @Override
    public void deleteAccountsInverse(String keyword, UserRole role, List<Long> ids) {
        List<Long> deleteIds = accountRepo.findInverseIds(
                keyword,
                role,
                ids);
        accountRepo.deleteAllById(deleteIds);
    }

    @Transactional
    public void deleteAllAccounts() {
        accountRepo.deleteAll();
    }

    public ProfileDTO getProfile(Account user) {
        IProfile currProfile = profileRepo.findProfileByUser(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found!"));
        return accountMapper.projectionToProfileDTO(currProfile);
    }

    @Transactional
    public AccountProfile updateProfile(ProfileRequest request, MultipartFile file, Account user) {
        AccountProfile profile = profileRepo.findById(user.getProfile().getId()).orElseThrow(()
                -> new ResourceNotFoundException("Profile not found!"));

        //Image upload/replace
        profile = this.changeProfilePic(file, request.getImage(), profile);

        //Set info
        profile.setName(request.getName());
        profile.setPhone(request.getPhone());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());

        return profileRepo.save(profile); //Save to Database
    }

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

        //Email event
        eventPublisher.publishEvent(new OnResetPasswordCompletedEvent(
                user.getUsername(),
                user.getEmail()));

        return savedAccount; //Return updated account
    }

    /**
     * Updates the profile picture of a user account. This method allows uploading
     * a new profile picture, replacing an existing one, or removing the profile picture.
     *
     * @param file the new image file to be uploaded as the profile picture, can be null for removing the image
     * @param image the identifier of the image, used for determining if an image should be removed, can be null
     * @param profile the account profile to be updated
     * @return the updated account profile with the modified profile picture
     */
    protected AccountProfile changeProfilePic(MultipartFile file, String image, AccountProfile profile) {
        if (file != null) { //Contain new image >> upload/replace
            if (profile.getImage() != null) imageService.deleteImage(profile.getImage().getId()); //Delete old image
            Image savedImage = imageService.upload(file, FileUploadUtil.USER_FOLDER);//Upload new image
            profile.setImage(savedImage); //Set new image
        } else if (image == null) { //Remove image
            if (profile.getImage() != null) imageService.deleteImage(profile.getImage().getId()); //Delete old image
            profile.setImage(null);
        }

        return profile;
    }
}
