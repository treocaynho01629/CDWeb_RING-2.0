package com.ring.bookstore.dtos.mappers;

import java.time.LocalDate;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.accounts.ProfileDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;

@Service
public class ProfileMapper implements Function<Account, ProfileDTO> {

    @Override
    public ProfileDTO apply(Account user) {

        AccountProfile profile = (profile = user.getProfile()) != null ? profile : new AccountProfile();
        String fileDownloadUri = profile.getImage() != null ? profile.getImage().getFileDownloadUri() : null;
        String name = (name = profile.getName()) != null ? name : "";
        String phone = (phone = profile.getPhone()) != null ? phone : "";
        String gender = (gender = profile.getGender()) != null ? gender : "";
        LocalDate dob = (dob = profile.getDob()) != null ? dob : LocalDate.of(2000, 1, 1);

        return new ProfileDTO(fileDownloadUri
                , name
                , user.getEmail()
                , phone
                , gender
                , dob);
    }
}
