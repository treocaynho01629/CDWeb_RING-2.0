package com.ring.bookstore.enums;

import lombok.Getter;

@Getter
public enum UserRole {
    ROLE_USER("ROLE_USER", "Thành viên", "default"),
    ROLE_SELLER("ROLE_SELLER", "Người bán", "info"),
    ROLE_ADMIN("ROLE_ADMIN", "Quản trị viên", "primary"),
    ROLE_GUEST("ROLE_GUEST", "Khách", "warning");

    private final String value;
    private final String label;
    private final String color;

    private UserRole(String value, String label, String color) {
        this.value = value;
        this.label = label;
        this.color = color;
    }

}
