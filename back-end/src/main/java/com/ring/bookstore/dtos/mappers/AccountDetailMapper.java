package com.ring.bookstore.dtos.mappers;

import java.time.LocalDate;
import java.util.function.Function;

import com.ring.bookstore.model.Image;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.AccountDetailDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class AccountDetailMapper implements Function<Account, AccountDetailDTO> {

    @Override
    public AccountDetailDTO apply(Account user) {

        AccountProfile profile = (profile = user.getProfile()) != null ? profile : null;
        Image image = (image = profile.getImage()) != null ? image : null;
        String fileDownloadUri = image != null ? image.getFileDownloadUri() : null;
        String name = (name = profile.getName()) != null ? name : "";
        String phone = (phone = profile.getPhone()) != null ? phone : "";
        String gender = (gender = profile.getGender()) != null ? gender : "";
        String address = (address = profile.getAddress()) != null ? address : "";
        LocalDate dob = (dob = profile.getDob()) != null ? dob : LocalDate.of(2000, 1, 1);

        return new AccountDetailDTO(user.getId(),
                user.getUsername(),
                fileDownloadUri,
                user.getEmail(),
                user.getRoles().size(),
                name,
                phone,
                gender,
                address,
                dob);
    }
}
