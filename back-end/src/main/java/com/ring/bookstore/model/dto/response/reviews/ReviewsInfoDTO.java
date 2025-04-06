package com.ring.bookstore.model.dto.response.reviews;

import java.util.List;

public record ReviewsInfoDTO(Double rating, Integer total, List<Integer> rates) {

}
