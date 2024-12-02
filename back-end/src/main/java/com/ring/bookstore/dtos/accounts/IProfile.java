package com.ring.bookstore.dtos.accounts;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface IProfile {

    String getName();

    String getEmail();

    String getPhone();

    String getGender();

    LocalDate getDob();

    String getImage();

    LocalDateTime getJoinedDate();

    Integer getTotalFollows();

    Integer getTotalReviews();
}
