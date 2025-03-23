package com.ring.bookstore.dtos.mappers;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.bookstore.dtos.accounts.*;
import com.ring.bookstore.dtos.images.IImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@RequiredArgsConstructor
@Service
public class AccountMapper {

    private final Cloudinary cloudinary;

    public AccountDTO projectionToDTO(IAccount projection) {
        IImage image = projection.getImage();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(55)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality(50)
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new AccountDTO(projection.getId(),
                projection.getUsername(),
                projection.getEmail(),
                projection.getName(),
                projection.getPhone(),
                url,
                projection.getRoles().get(projection.getRoles().size() - 1).getRoleName());
    }

    public AccountDetailDTO projectionToDetailDTO(IAccountDetail projection) {
        LocalDate dob = (dob = projection.getDob()) != null ? dob : LocalDate.of(1970, 1, 1);
        IImage image = projection.getImage();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(120)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality("auto")
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new AccountDetailDTO(projection.getId(),
                projection.getUsername(),
                url,
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
        IImage image = projection.getImage();
        String url = image != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(120)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality("auto")
                                .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId())
                : null;

        return new ProfileDTO(url,
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
