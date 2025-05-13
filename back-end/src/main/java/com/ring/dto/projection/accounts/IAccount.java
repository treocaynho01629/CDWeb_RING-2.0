package com.ring.dto.projection.accounts;

import com.ring.dto.projection.images.IImage;
import com.ring.model.enums.UserRole;

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

    List<UserRole> getRoles();

    IImage getImage();
}
