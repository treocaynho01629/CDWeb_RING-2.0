package com.ring.bookstore.dtos.accounts;

import com.ring.bookstore.model.Role;

import java.util.List;

public interface IAccount {
    Long getId();

    String getUsername();

    String getImage();

    String getEmail();

    String getName();

    String getPhone();

    List<Role> getRoles();
}
