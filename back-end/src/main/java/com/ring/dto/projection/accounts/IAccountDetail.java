package com.ring.dto.projection.accounts;

import com.ring.dto.projection.images.IImage;
import com.ring.model.enums.Gender;
import com.ring.model.enums.UserRole;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    List<UserRole> getRoles();

    Gender getGender();

    LocalDate getDob();

    LocalDateTime getJoinedDate();

    Integer getTotalFollows();

    Integer getTotalReviews();

    IImage getImage();
}
