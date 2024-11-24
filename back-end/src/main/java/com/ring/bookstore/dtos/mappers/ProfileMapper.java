package com.ring.bookstore.dtos.mappers;

import java.time.LocalDate;
import java.util.function.Function;

import com.ring.bookstore.dtos.projections.IProfile;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.accounts.ProfileDTO;
import com.ring.bookstore.model.AccountProfile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class ProfileMapper implements Function<IProfile, ProfileDTO> {

    @Override
    public ProfileDTO apply(IProfile projection) {

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
