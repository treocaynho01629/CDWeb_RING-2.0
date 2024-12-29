package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.accounts.*;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.AccountProfile;
import com.ring.bookstore.model.Address;
import com.ring.bookstore.model.Image;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;

@Service
public class AccountMapper {

    public AccountDTO projectionToDTO(IAccount projection) {
        return new AccountDTO(projection.getId(),
                projection.getUsername(),
                projection.getEmail(),
                projection.getName(),
                projection.getPhone(),
                projection.getImage(),
                projection.getRoles());
    }

    public AccountDetailDTO accountToDetailDTO(Account user) {
        //Initial
        String name = "";
        String phone = "";
        String gender = "";
        LocalDate dob = LocalDate.of(2000, 1, 1);

        AccountProfile profile = (profile = user.getProfile()) != null ? profile : null;
        Address address = profile != null ? profile.getAddress() : null;
        Image image = profile != null ? profile.getImage() : null;
        String fileDownloadUri = image != null ? image.getFileDownloadUri() : null;

        if (profile != null) {
            name = (name = profile.getName()) != null ? name : "";
            phone = (phone = profile.getPhone()) != null ? phone : "";
            gender = (gender = profile.getGender()) != null ? gender : "";
            dob = (dob = profile.getDob()) != null ? dob : LocalDate.of(2000, 1, 1);
        }

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

    public ProfileDTO projectionToProfileDTO(IProfile projection) {
        String name = (name = projection.getName()) != null ? name : "";
        String phone = (phone = projection.getPhone()) != null ? phone : "";
        String gender = (gender = projection.getGender()) != null ? gender : "";
        LocalDate dob = (dob = projection.getDob()) != null ? dob : LocalDate.of(2000, 1, 1);
        String fileDownloadUri = projection.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(projection.getImage())
                        .toUriString()
                : null;

        return new ProfileDTO(fileDownloadUri
                , name
                , projection.getEmail()
                , phone
                , gender
                , dob
                , projection.getJoinedDate()
                , projection.getTotalFollows()
                , projection.getTotalReviews());
    }
}
