package com.ring.bookstore.model.enums;

import lombok.Getter;

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
