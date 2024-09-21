package com.ring.bookstore.dtos.mappers;

import java.time.LocalDate;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.ProfileDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;

@Service
public class ProfileMapper implements Function<Account, ProfileDTO> {
	
    @Override
    public ProfileDTO apply(Account user) {
    	
    	AccountProfile profile = user.getProfile();
    	String name = "";
    	String phone = "";
    	String gender = "";
    	String address = "";
    	LocalDate dob = LocalDate.of(2000, 1, 1);

    	if (profile != null) {
    		name = (name = profile.getName()) != null ? name : "";
    		phone = (phone = profile.getPhone()) != null ? phone : "";
    		gender = (gender = profile.getGender()) != null ? gender : "";
    		address = (address = profile.getAddress()) != null ? address : "";
    		dob = (dob = profile.getDob()) != null ? dob : LocalDate.of(2000, 1, 1);
    	}
    	
        return new ProfileDTO(user.getUsername()
        		,user.getEmail()
        		,name
        		,phone
        		,gender
        		,dob
        		,address);
    }
}
