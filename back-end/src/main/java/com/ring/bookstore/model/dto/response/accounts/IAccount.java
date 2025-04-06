package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.dto.response.images.IImage;
import com.ring.bookstore.model.entity.Role;

import java.util.List;

public interface IAccount {
    Long getId();

    String getUsername();

    String getEmail();

    String getName();

    String getPhone();

    List<Role> getRoles();

    IImage getImage();
}
