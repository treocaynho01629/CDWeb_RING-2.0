package com.ring.bookstore.dtos;

public record ReviewsInfoDTO(Double rating,
                             Integer totalRates,
                             Integer five,
                             Integer four,
                             Integer three,
                             Integer two,
                             Integer one) {

}
