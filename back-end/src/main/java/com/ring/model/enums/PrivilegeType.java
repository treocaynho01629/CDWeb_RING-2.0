package com.ring.model.enums;

import lombok.Getter;

/**
 * Enum representing the privilege type as {@link PrivilegeType}.
 */
@Getter
public enum PrivilegeType {

    READ_BOOK("read:book", "Xem sản phẩm"),
    CREATE_BOOK("create:book", "Tạo sản phẩm"),
    UPDATE_BOOK("update:book", "Sửa sản phẩm"),
    DELETE_BOOK("delete:book", "Xoá sản phẩm"),

    READ_USER("read:user", "Xem người dùng"),
    CREATE_USER("create:user", "Tạo người dùng"),
    UPDATE_USER("update:user", "Sửa người dùng"),
    DELETE_USER("delete:user", "Xoá người dùng"),

    READ_PROFILE("read:profile", "Xem hồ sơ"),
    UPDATE_PROFILE("update:profile", "Cập nhật hồ sơ"),

    READ_ADDRESS("read:address", "Xem địa chỉ"),
    CREATE_ADDRESS("create:address", "Tạo địa chỉ"),
    UPDATE_ADDRESS("update:address", "Sửa địa chỉ"),
    DELETE_ADDRESS("delete:address", "Xoá địa chỉ"),

    READ_BANNER("read:banner", "Xem banner"),
    CREATE_BANNER("create:banner", "Tạo banner"),
    UPDATE_BANNER("update:banner", "Sửa banner"),
    DELETE_BANNER("delete:banner", "Xoá banner"),

    READ_CATEGORY("read:category", "Xem danh mục"),
    CREATE_CATEGORY("create:category", "Tạo danh mục"),
    UPDATE_CATEGORY("update:category", "Sửa danh mục"),
    DELETE_CATEGORY("delete:category", "Xoá danh mục"),

    READ_PUBLISHER("read:publisher", "Xem nhà xuất bản"),
    CREATE_PUBLISHER("create:publisher", "Tạo nhà xuất bản"),
    UPDATE_PUBLISHER("update:publisher", "Sửa nhà xuất bản"),
    DELETE_PUBLISHER("delete:publisher", "Xoá nhà xuất bản"),

    READ_COUPON("read:coupon", "Xem mã giảm giá"),
    CREATE_COUPON("create:coupon", "Tạo mã giảm giá"),
    UPDATE_COUPON("update:coupon", "Sửa mã giảm giá"),
    DELETE_COUPON("delete:coupon", "Xoá mã giảm giá"),

    READ_IMAGE("read:image", "Xem hình ảnh"),
    CREATE_IMAGE("create:image", "Tải hình ảnh"),
    UPDATE_IMAGE("update:image", "Sửa hình ảnh"),
    DELETE_IMAGE("delete:image", "Xoá hình ảnh"),

    READ_ORDER("read:order", "Xem đơn hàng"),
    WRITE_ORDER("create:order", "Tạo đơn hàng"),
    UPDATE_ORDER("update:order", "Cập nhật đơn hàng"),

    READ_ROLE("read:role", "Xem vai trò"),
    UPDATE_ROLE("update:role", "Cập nhật vai trò"),

    READ_SHOP("read:shop", "Xem cửa hàng"),
    CREATE_SHOP("create:shop", "Tạo cửa hàng"),
    UPDATE_SHOP("update:shop", "Sửa cửa hàng"),
    DELETE_SHOP("delete:shop", "Xoá cửa hàng"),

    READ_REVIEW("read:review", "Xem đánh giá"),
    CREATE_REVIEW("create:review", "Tạo đánh giá"),
    UPDATE_REVIEW("update:review", "Sửa đánh giá"),
    DELETE_REVIEW("delete:review", "Xoá đánh giá");

    private final String privilege;
    private final String label;

    private PrivilegeType(String privilege, String label) {
        this.privilege = privilege;
        this.label = label;
    }

}
