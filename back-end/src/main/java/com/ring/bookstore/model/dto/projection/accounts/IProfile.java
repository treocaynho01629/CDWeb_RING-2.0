package com.ring.bookstore.model.dto.projection.accounts;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a profile projection as {@link IProfile}, containing the user's
 * name, email, phone, gender, date of birth, join date, total follows, total reviews, and profile image.
 */
public interface IProfile {

    String getName();

    String getEmail();

    String getPhone();

    Gender getGender();

    LocalDate getDob();

    LocalDateTime getJoinedDate();

    Integer getTotalFollows();

    Integer getTotalReviews();

    IImage getImage();
}
