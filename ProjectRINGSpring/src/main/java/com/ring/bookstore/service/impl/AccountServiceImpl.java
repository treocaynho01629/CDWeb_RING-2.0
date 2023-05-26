package com.ring.bookstore.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.AccountDetailDTO;
import com.ring.bookstore.dtos.ProfileDTO;
import com.ring.bookstore.dtos.mappers.AccountDetailMapper;
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
import com.ring.bookstore.response.IChartResponse;
import com.ring.bookstore.service.AccountService;
import com.ring.bookstore.service.EmailService;
import com.ring.bookstore.service.RoleService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService { //Dịch vụ Người dùng
	
	private final AccountRepository accountRepo;
	private final AccountProfileRepository profileRepo;
	private final PasswordEncoder passwordEncoder;
	private final RoleService roleService;
	private final EmailService emailService;
	
	@Autowired
	private ProfileMapper profileMapper;
	@Autowired
	private AccountDetailMapper detailMapper;
	
	//Lấy tất cả Người dùng
	public Page<Account> getAllAccounts(Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
				: Sort.by(sortBy).descending());
		return accountRepo.findAll(pageable); //Trả Người dùng về theo phân trang
	}
	
	//Lấy tất cả Nhân viên
	public Page<Account> getAllEmployees(Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
		Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Tạo phân trang
				: Sort.by(sortBy).descending());
		return accountRepo.findEmployees(pageable); //Trả Người dùng về theo phân trang
	}

	//Lấy Người dùng theo {id}
	public AccountDetailDTO getAccountById(Integer id) {
		Account account = accountRepo.findById(id).orElseThrow(() -> 
					new ResourceNotFoundException("User does not exists!")); //Báo Exception nếu ko tồn tại
		return detailMapper.apply(account);
	}
	
	//Tạo Người dùng (ADMIN)
	public Account saveAccount(AccountRequest request) {
		
		//Kiểm tra Người dùng vs Username và email đã tồn tại chưa >> Báo Exception
	    if (!accountRepo.findByUserName(request.getUserName()).isEmpty()){
	    	throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
	    }
	
	    //Set Quyền cho Người dùng: 1 USER, 2 SELLER, 3 ADMIN
	    Set<Role> roles = new HashSet<>();
	    roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));
	
	    if (request.getRoles() >= 2) {
		    roles.add(roleService.findByRoleName(RoleName.ROLE_SELLER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
	    } else if (request.getRoles() >= 3) {
		    roles.add(roleService.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
	    }
		
	    //Tạo Người dùng + set thông tin
		var acc = Account.builder()
		            .userName(request.getUserName())
		            .pass(passwordEncoder.encode(request.getPass()))
		            .email(request.getEmail())
		            .roles(roles)
		            .build();
		 
	    Account savedAccount = accountRepo.save(acc); //Lưu Người dùng vào CSDL
		
		//Tạo Hồ sơ + set thông tin
		var profile = AccountProfile.builder()
				.name(request.getName())
				.phone(request.getPhone())
				.address(request.getAddress())
				.dob(request.getDob())
				.gender(request.getGender())
				.user(savedAccount)
				.build();
		
		profileRepo.save(profile); //Lưu Hồ sơ vào CSDL
		return savedAccount; //Trả Người dùng vừa lưu
	}

	//Cập nhật Người dùng (ADMIN)
	public Account updateAccount(AccountRequest request, Integer id) {
		//Kiểm tra Người dùng có tồn tại?
	    Account currUser = accountRepo.findById(id)
	            .orElseThrow(()-> new ResourceNotFoundException("User does not exist!"));
	    
	    //Kiểm tra Người dùng vs Username và Email đã tồn tại chưa
  		if (!request.getUserName().equals(currUser.getUsername()) && !accountRepo.findByUserName(request.getUserName()).isEmpty()){
  			throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Người dùng với tên đăng nhập này đã tồn tại!");
  		}
		
	    //Set Quyền cho Người dùng: 1 USER, 2 SELLER, 3 ADMIN
		Set<Role> roles = new HashSet<>();
		roles.add(roleService.findByRoleName(RoleName.ROLE_USER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "No roles has been set")));
		
		if (request.getRoles() >= 2) {
		    roles.add(roleService.findByRoleName(RoleName.ROLE_SELLER).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
		} 
		if (request.getRoles() >= 3) {
		    roles.add(roleService.findByRoleName(RoleName.ROLE_ADMIN).orElseThrow(() -> new HttpResponseException(HttpStatus.NOT_FOUND, "Role not found")));
		}
		
		//Set thông tin mới cho Người dùng
		currUser.setUserName(request.getUserName());
		currUser.setEmail(request.getEmail());
		currUser.setRoles(roles);
		if (!request.isKeepOldPass())currUser.setPass(passwordEncoder.encode(request.getPass())); //Đổi pass với điều kiện
		
	    Account updatedAccount = accountRepo.save(currUser); //Lưu lại Người dùng vào CSDL
		
	    //Lấy Hồ sơ cũ
		AccountProfile profile = updatedAccount.getProfile();
		
		//Nếu chưa có >> tạo Hồ sơ mới
		if (profile == null) {
			profile = new AccountProfile();
			profile.setUser(updatedAccount);
		}
		
		//Set dữ liệu mới cho Hồ sơ
		profile.setName(request.getName());
		profile.setPhone(request.getPhone());
		profile.setAddress(request.getAddress());
		profile.setDob(request.getDob());
		profile.setGender(request.getGender());
		
		profileRepo.save(profile); //Lưu lại Hồ sơ vào CSDL
		return updatedAccount; //Trả lại Người dùng vừa cập nhật
	}

	//Xoá Người dùng (ADMIN)
	public void deleteAccount(Integer id) {
		//Kiểm tra Người dùng có tồn tại?
	    Account account = accountRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User does not exist!"));
	    
	    //Gỡ quan hệ (Đơn hàng, Sách bán, Đánh giá, Quyền) KHÔNG XOÁ
	    account.removeAllOrders();
	    account.removeAllBooks();
	    account.removeAllReviews();
	    account.removeAllRoles();
	    
	    Account savedAccount = accountRepo.save(account); //Lưu gỡ quyền vào CSDL
		accountRepo.delete(savedAccount); //Xoá khỏi CSDL
	}
	
	//Xoá nhiều Người dùng (ADMIN)
	@Transactional
	public void deleteAccounts(List<Integer> ids) {
		//Duyệt từng Người dùng
		for (Integer id : ids) {
			Account account = accountRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User does not exist!"));
			
			//Gỡ quan hệ (Đơn hàng, Sách bán, Đánh giá, Quyền) KHÔNG XOÁ
		    account.removeAllOrders();
		    account.removeAllBooks();
		    account.removeAllReviews();
		    account.removeAllRoles();
		    
			accountRepo.deleteById(id); //Xoá khỏi CSDL
		}
	}
	
	//Xoá tất cả Người dùng (ADMIN)
	@Transactional
	public void deleteAllAccounts() {
		for (Account account : accountRepo.findAll()) {
			//Gỡ quan hệ (Đơn hàng, Sách bán, Đánh giá, Quyền) KHÔNG XOÁ
		    account.removeAllOrders();
		    account.removeAllBooks();
		    account.removeAllReviews();
		    account.removeAllRoles();
		}
		
		accountRepo.deleteAll();
	}
	
	//Lấy Hồ sơ Người dùng
	public ProfileDTO getProfile(Account user) {
		return profileMapper.apply(user);
	}

	//Câp nhật Hồ sơ Người dùng
	@Override
	public AccountProfile updateProfile(ProfileRequest request, Account user) {
		AccountProfile profile = user.getProfile();
		
		//Nếu chưa có Hồ sơ >> tạo mới
		if (profile == null) {
			profile = new AccountProfile();
			profile.setUser(user);
		}
		
		//Set thông tin mới cho Hồ sơ
		profile.setName(request.getName());
		profile.setPhone(request.getPhone());
		profile.setAddress(request.getAddress());
		profile.setDob(request.getDob());
		profile.setGender(request.getGender());
		
		AccountProfile updatedProfile = profileRepo.save(profile); //Lưu vào CSDL và trả về
		return updatedProfile;
	}

	//Đổi mật khẩu Người dùng
	@Override
	public Account changePassword(ChangePassRequest request, Account user) {
		//Kiểm tra mật khẩu hiện tại có đúng ko
        if (!passwordEncoder.matches(request.getPass(), user.getPass())) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không đúng!");
        //Kiểm tra mật khẩu mới có trùng khớp không
        if (!request.getNewPass().equals(request.getNewPassRe())) throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Mật khẩu không trùng khớp!");
        
        // Đổi mật khẩu, lưu vào CSDL
        user.setPass(passwordEncoder.encode(request.getNewPass()));
        Account savedAccount = accountRepo.save(user);
        
        //Tạo và gửi Email
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
        emailService.sendHtmlMessage(user.getEmail(), subject, content); //Gửi
        
        return savedAccount; //Trả về
	}
	
	//Lấy dữ liệu top Người dùng
	public List<IChartResponse> getTopAccount() {
		return accountRepo.getTopUser();
	}

	//Lấy dữ liệu top Nhân viên
	public List<IChartResponse> getTopSeller() {
		return accountRepo.getTopSeller();
	}
}
