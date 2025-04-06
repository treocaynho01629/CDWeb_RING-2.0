package com.ring.bookstore.model.dto.projection.accounts;

import com.ring.bookstore.model.dto.projection.images.IImage;
import com.ring.bookstore.model.dto.request.AccountRequest;
import com.ring.bookstore.model.entity.Role;

import java.util.List;

/**
 * Represents an account projection as {@link IAccount} contains user's ID, username, email,
 * name, phone, roles, profile image.
 */
public interface IAccount {

    Long getId();

    String getUsername();

    String getEmail();

    String getName();

    String getPhone();

    List<Role> getRoles();

    IImage getImage();
}
