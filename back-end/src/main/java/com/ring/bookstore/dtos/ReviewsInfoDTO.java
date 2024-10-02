package com.ring.bookstore.dtos;

import java.util.List;

public record ReviewsInfoDTO(Double rating,
                             List<Integer> count ) {

}
