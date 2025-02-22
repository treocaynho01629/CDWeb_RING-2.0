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
        String fileDownloadUri = projection.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(projection.getImage())
                        .toUriString()
                : null;

        return new AccountDTO(projection.getId(),
                projection.getUsername(),
                projection.getEmail(),
                projection.getName(),
                projection.getPhone(),
                fileDownloadUri,
                projection.getRoles().get(projection.getRoles().size() - 1).getRoleName());
    }

    public AccountDetailDTO projectionToDetailDTO(IAccountDetail projection) {
        LocalDate dob = (dob = projection.getDob()) != null ? dob : LocalDate.of(1970, 1, 1);
        String fileDownloadUri = projection.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(projection.getImage())
                        .toUriString()
                : null;

        return new AccountDetailDTO(projection.getId(),
                projection.getUsername(),
                fileDownloadUri,
                projection.getEmail(),
                projection.getRoles(),
                projection.getName(),
                projection.getPhone(),
                projection.getGender(),
                dob,
                projection.getJoinedDate(),
                projection.getTotalFollows(),
                projection.getTotalReviews());
    }

    public ProfileDTO projectionToProfileDTO(IProfile projection) {
        LocalDate dob = (dob = projection.getDob()) != null ? dob : LocalDate.of(1970, 1, 1);
        String fileDownloadUri = projection.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(projection.getImage())
                        .toUriString()
                : null;

        return new ProfileDTO(fileDownloadUri,
                projection.getName(),
                projection.getEmail(),
                projection.getPhone(),
                projection.getGender(),
                dob,
                projection.getJoinedDate(),
                projection.getTotalFollows(),
                projection.getTotalReviews());
    }
}
