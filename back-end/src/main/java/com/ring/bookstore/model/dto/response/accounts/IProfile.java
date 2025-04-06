package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.dto.response.images.IImage;
import com.ring.bookstore.model.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
