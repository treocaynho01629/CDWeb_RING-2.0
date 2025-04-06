package com.ring.bookstore.model.enums;

import lombok.Getter;

@Getter
public enum BookType {
    HARD_COVER("HARD_COVER", "Bìa cứng"),
    SOFT_COVER("SOFT_COVER", "Bìa mềm"),
    WOOD_COVER("WOOD_COVER", "Bìa gỗ"),
    SLIP_COVER("SLIP_COVER", "Bìa rời"),
    OTHERS("OTHERS", "Khác");

    private final String value;
    private final String label;

    private BookType(String value, String label) {
        this.value = value;
        this.label = label;
    }
}
