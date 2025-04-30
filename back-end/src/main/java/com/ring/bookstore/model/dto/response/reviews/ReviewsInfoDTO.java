package com.ring.bookstore.model.dto.response.reviews;

import java.util.List;

/**
 * Represents a review info response as {@link ReviewsInfoDTO}.
 */
public record ReviewsInfoDTO(Double rating, Integer total, List<Integer> rates) {

}
