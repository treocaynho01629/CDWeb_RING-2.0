package com.ring.bookstore.dtos.reviews;

import java.util.List;

public record ReviewsInfoDTO(Double rating,
                             List<Integer> count ) {

}
