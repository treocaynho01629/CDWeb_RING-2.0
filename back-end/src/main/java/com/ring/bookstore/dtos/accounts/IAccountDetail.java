package com.ring.bookstore.dtos.accounts;

import com.ring.bookstore.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface IAccountDetail {
    Long getId();

    String getUsername();

    String getImage();

    String getEmail();

    String getName();

    String getPhone();

    Short getRoles();

    Gender getGender();

    LocalDate getDob();

    LocalDateTime getJoinedDate();

    Integer getTotalFollows();

    Integer getTotalReviews();
}
