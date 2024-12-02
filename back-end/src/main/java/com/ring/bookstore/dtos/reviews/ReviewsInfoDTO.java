package com.ring.bookstore.dtos.reviews;

import java.util.List;

public record ReviewsInfoDTO(Double rating, Integer total, List<Integer> rates) {

}
