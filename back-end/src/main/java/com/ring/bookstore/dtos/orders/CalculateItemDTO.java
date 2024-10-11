package com.ring.bookstore.dtos;

import java.math.BigDecimal;

public record CalculateItemDTO(Double price,
                               BigDecimal discount,
                               Short amount,
                               Long id,
                               String slug,
                               String title) {

}
