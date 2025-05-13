package com.ring.model.enums;

import lombok.Getter;

import java.util.List;

/**
 * Enum representing the privilege group as {@link PrivilegeGroupType}.
 */
@Getter
public enum PrivilegeGroupType {

    BOOK_PRIVILEGE("Sản phẩm",
            List.of(
                    PrivilegeType.READ_BOOK,
                    PrivilegeType.CREATE_BOOK,
                    PrivilegeType.UPDATE_BOOK,
                    PrivilegeType.DELETE_BOOK
            )
    ),
    USER_PRIVILEGE("Người dùng",
            List.of(
                    PrivilegeType.READ_USER,
                    PrivilegeType.CREATE_USER,
                    PrivilegeType.UPDATE_USER,
                    PrivilegeType.DELETE_USER
            )
    ),
    PROFILE_PRIVILEGE("Hồ sơ",
            List.of(
                    PrivilegeType.READ_PROFILE,
                    PrivilegeType.UPDATE_PROFILE
            )
    ),
    ADDRESS_PRIVILEGE("Địa chỉ",
            List.of(
                    PrivilegeType.READ_ADDRESS,
                    PrivilegeType.CREATE_ADDRESS,
                    PrivilegeType.UPDATE_ADDRESS,
                    PrivilegeType.DELETE_ADDRESS
            )
    ),
    BANNER_PRIVILEGE("Banner",
            List.of(
                    PrivilegeType.READ_BANNER,
                    PrivilegeType.CREATE_BANNER,
                    PrivilegeType.UPDATE_BANNER,
                    PrivilegeType.DELETE_BANNER
            )
    ),
    CATEGORY_PRIVILEGE("Danh mục",
            List.of(
                    PrivilegeType.READ_CATEGORY,
                    PrivilegeType.CREATE_CATEGORY,
                    PrivilegeType.UPDATE_CATEGORY,
                    PrivilegeType.DELETE_CATEGORY
            )
    ),
    PUBLISHER_PRIVILEGE("Nhà xuất bản",
            List.of(
                    PrivilegeType.READ_PUBLISHER,
                    PrivilegeType.CREATE_PUBLISHER,
                    PrivilegeType.UPDATE_PUBLISHER,
                    PrivilegeType.DELETE_PUBLISHER
            )
    ),
    COUPON_PRIVILEGE("Mã giảm giá",
            List.of(
                    PrivilegeType.READ_COUPON,
                    PrivilegeType.CREATE_COUPON,
                    PrivilegeType.UPDATE_COUPON,
                    PrivilegeType.DELETE_COUPON
            )
    ),
    IMAGE_PRIVILEGE("Hình ảnh",
            List.of(
                    PrivilegeType.READ_IMAGE,
                    PrivilegeType.CREATE_IMAGE,
                    PrivilegeType.UPDATE_IMAGE,
                    PrivilegeType.DELETE_IMAGE
            )
    ),
    ORDER_PRIVILEGE("Đơn hàng",
            List.of(
                    PrivilegeType.READ_ORDER,
                    PrivilegeType.WRITE_ORDER,
                    PrivilegeType.UPDATE_ORDER
            )
    ),
    ROLE_PRIVILEGE("Vai trò",
            List.of(
                    PrivilegeType.READ_ROLE,
                    PrivilegeType.UPDATE_ROLE
            )
    ),
    SHOP_PRIVILEGE("Cửa hàng",
            List.of(
                    PrivilegeType.READ_SHOP,
                    PrivilegeType.CREATE_SHOP,
                    PrivilegeType.UPDATE_SHOP,
                    PrivilegeType.DELETE_SHOP
            )
    ),
    REVIEW_PRIVILEGE("Đánh giá",
            List.of(
                    PrivilegeType.READ_REVIEW,
                    PrivilegeType.CREATE_REVIEW,
                    PrivilegeType.UPDATE_REVIEW,
                    PrivilegeType.DELETE_REVIEW
            )
    );

    private final String label;
    private final List<PrivilegeType> privileges;

    private PrivilegeGroupType(String label, List<PrivilegeType> privileges) {
        this.label = label;
        this.privileges = privileges;
    }
}
