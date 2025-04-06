package com.ring.bookstore.model.dto.response.images;

import java.util.Map;

/**
 * Represents an image response as {@link ImageDTO}.
 */
public record ImageDTO(String url, Map<String, String> srcSet) {
}
