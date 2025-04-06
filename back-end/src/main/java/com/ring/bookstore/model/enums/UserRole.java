package com.ring.bookstore.model.enums;

import lombok.Getter;

import java.util.List;

@Getter
public enum UserRole {

    ROLE_USER("ROLE_USER",
            "Thành viên",
            "default",
            List.of(
                    PrivilegeType.READ_PROFILE,
                    PrivilegeType.UPDATE_PROFILE,
                    PrivilegeType.READ_ADDRESS,
                    PrivilegeType.CREATE_ADDRESS,
                    PrivilegeType.UPDATE_ADDRESS,
                    PrivilegeType.DELETE_ADDRESS,
                    PrivilegeType.READ_ORDER,
                    PrivilegeType.WRITE_ORDER,
                    PrivilegeType.UPDATE_ORDER,
                    PrivilegeType.READ_REVIEW,
                    PrivilegeType.CREATE_REVIEW,
                    PrivilegeType.UPDATE_REVIEW
            )),
    ROLE_SELLER("ROLE_SELLER",
            "Người bán",
            "info",
            List.of(
                    PrivilegeType.READ_BOOK,
                    PrivilegeType.CREATE_BOOK,
                    PrivilegeType.UPDATE_BOOK,
                    PrivilegeType.DELETE_BOOK,
                    PrivilegeType.READ_PROFILE,
                    PrivilegeType.UPDATE_PROFILE,
                    PrivilegeType.READ_ADDRESS,
                    PrivilegeType.CREATE_ADDRESS,
                    PrivilegeType.UPDATE_ADDRESS,
                    PrivilegeType.DELETE_ADDRESS,
                    PrivilegeType.READ_BANNER,
                    PrivilegeType.CREATE_BANNER,
                    PrivilegeType.UPDATE_BANNER,
                    PrivilegeType.DELETE_BANNER,
                    PrivilegeType.READ_COUPON,
                    PrivilegeType.CREATE_COUPON,
                    PrivilegeType.UPDATE_COUPON,
                    PrivilegeType.DELETE_COUPON,
                    PrivilegeType.READ_ORDER,
                    PrivilegeType.WRITE_ORDER,
                    PrivilegeType.UPDATE_ORDER,
                    PrivilegeType.READ_SHOP,
                    PrivilegeType.CREATE_SHOP,
                    PrivilegeType.UPDATE_SHOP,
                    PrivilegeType.DELETE_SHOP,
                    PrivilegeType.READ_REVIEW,
                    PrivilegeType.CREATE_REVIEW,
                    PrivilegeType.UPDATE_REVIEW,
                    PrivilegeType.DELETE_REVIEW
            )),
    ROLE_ADMIN("ROLE_ADMIN",
            "Quản trị viên",
            "primary",
            List.of(
                    PrivilegeType.READ_BOOK,
                    PrivilegeType.CREATE_BOOK,
                    PrivilegeType.UPDATE_BOOK,
                    PrivilegeType.DELETE_BOOK,
                    PrivilegeType.READ_USER,
                    PrivilegeType.CREATE_USER,
                    PrivilegeType.UPDATE_USER,
                    PrivilegeType.DELETE_USER,
                    PrivilegeType.READ_PROFILE,
                    PrivilegeType.UPDATE_PROFILE,
                    PrivilegeType.READ_ADDRESS,
                    PrivilegeType.CREATE_ADDRESS,
                    PrivilegeType.UPDATE_ADDRESS,
                    PrivilegeType.DELETE_ADDRESS,
                    PrivilegeType.READ_BANNER,
                    PrivilegeType.CREATE_BANNER,
                    PrivilegeType.UPDATE_BANNER,
                    PrivilegeType.DELETE_BANNER,
                    PrivilegeType.READ_CATEGORY,
                    PrivilegeType.CREATE_CATEGORY,
                    PrivilegeType.UPDATE_CATEGORY,
                    PrivilegeType.DELETE_CATEGORY,
                    PrivilegeType.READ_PUBLISHER,
                    PrivilegeType.CREATE_PUBLISHER,
                    PrivilegeType.UPDATE_PUBLISHER,
                    PrivilegeType.DELETE_PUBLISHER,
                    PrivilegeType.READ_COUPON,
                    PrivilegeType.CREATE_COUPON,
                    PrivilegeType.UPDATE_COUPON,
                    PrivilegeType.DELETE_COUPON,
                    PrivilegeType.READ_IMAGE,
                    PrivilegeType.CREATE_IMAGE,
                    PrivilegeType.UPDATE_IMAGE,
                    PrivilegeType.DELETE_IMAGE,
                    PrivilegeType.READ_ORDER,
                    PrivilegeType.WRITE_ORDER,
                    PrivilegeType.UPDATE_ORDER,
                    PrivilegeType.READ_ROLE,
                    PrivilegeType.UPDATE_ROLE,
                    PrivilegeType.READ_SHOP,
                    PrivilegeType.CREATE_SHOP,
                    PrivilegeType.UPDATE_SHOP,
                    PrivilegeType.DELETE_SHOP,
                    PrivilegeType.READ_REVIEW,
                    PrivilegeType.CREATE_REVIEW,
                    PrivilegeType.UPDATE_REVIEW,
                    PrivilegeType.DELETE_REVIEW
            )),

    ROLE_GUEST("ROLE_GUEST",
            "Khách",
            "warning",
            List.of(
                    PrivilegeType.READ_BOOK,
                    PrivilegeType.READ_PROFILE,
                    PrivilegeType.READ_ADDRESS,
                    PrivilegeType.READ_BANNER,
                    PrivilegeType.READ_COUPON,
                    PrivilegeType.READ_ORDER,
                    PrivilegeType.READ_SHOP,
                    PrivilegeType.READ_REVIEW
            ));

    private final String value;
    private final String label;
    private final String color;
    private final List<PrivilegeType> privileges;

    private UserRole(String value, String label, String color, List<PrivilegeType> privileges) {
        this.value = value;
        this.label = label;
        this.color = color;
        this.privileges = privileges;
    }

}
