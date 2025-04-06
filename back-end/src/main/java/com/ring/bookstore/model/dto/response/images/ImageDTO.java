package com.ring.bookstore.model.dto.response.images;

import java.util.Map;

public record ImageDTO(String url, Map<String, String> srcSet) {
}
