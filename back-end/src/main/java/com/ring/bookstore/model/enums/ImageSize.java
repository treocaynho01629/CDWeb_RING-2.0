package com.ring.bookstore.model.enums;

import lombok.Getter;

@Getter
public enum ImageSize {
    TINY("TINY", 65),
	SMALL("SMALL", 180),
    MEDIUM("MEDIUM", 405);

    private final String value;
    private final Integer width;

    private ImageSize(String value, Integer width) {
        this.value = value;
        this.width = width;
    }

}
