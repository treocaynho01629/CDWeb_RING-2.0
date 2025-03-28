package com.ring.bookstore.dtos.images;

import java.util.Map;

public record ImageDTO(String url, Map<String, String> srcSet) {
}
