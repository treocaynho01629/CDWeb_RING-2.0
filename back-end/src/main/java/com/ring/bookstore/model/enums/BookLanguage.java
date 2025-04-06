package com.ring.bookstore.model.enums;

import lombok.Getter;

/**
 * Enum representing the language of a book as {@link BookLanguage}.
 * Each enum constant contains a label (language name in the local language).
 */
@Getter
public enum BookLanguage {
    VN("VN", "Tiếng Việt"),
    EN("EN", "Tiếng Anh"),
    CN("CN", "Tiếng Trung"),
    JP("JP", "Tiếng Nhật");

    private final String value;
    private final String label;

    private BookLanguage(String value, String label) {
        this.value = value;
        this.label = label;
    }

}
