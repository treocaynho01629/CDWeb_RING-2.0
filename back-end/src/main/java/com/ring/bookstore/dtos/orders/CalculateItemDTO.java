package com.ring.bookstore.dtos.orders;

import java.math.BigDecimal;

public record CalculateItemDTO(Double price,
                               BigDecimal discount,
                               Short amount,
                               Short quantity,
                               Long id,
                               String slug,
                               String title) {

}
