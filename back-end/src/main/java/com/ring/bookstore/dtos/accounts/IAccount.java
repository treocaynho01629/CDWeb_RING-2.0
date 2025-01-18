package com.ring.bookstore.dtos.accounts;

import java.time.LocalDate;

public interface IAccount {
    Long getId();

    String getUsername();

    String getImage();

    String getEmail();

    String getName();

    String getPhone();

    Short getRoles();
}
