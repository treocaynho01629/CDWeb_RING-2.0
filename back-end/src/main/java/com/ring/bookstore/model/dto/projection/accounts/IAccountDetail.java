package com.ring.bookstore.model.dto.projection.accounts;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a detailed account projection as {@link IAccountDetail}, containing the user's
 * ID, username, email, name, phone, roles, gender, date of birth, join date, total follows,
 * total reviews, and profile image.
 */
public interface IAccountDetail {

    Long getId();

    String getUsername();

    String getEmail();

    String getName();

    String getPhone();

    Short getRoles();

    Gender getGender();

    LocalDate getDob();

    LocalDateTime getJoinedDate();

    Integer getTotalFollows();

    Integer getTotalReviews();

    IImage getImage();
}
