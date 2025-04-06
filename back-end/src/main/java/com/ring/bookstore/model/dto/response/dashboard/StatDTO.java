package com.ring.bookstore.model.dto.response.dashboard;

import java.math.BigDecimal;

public record StatDTO(String id,
                      String label,
                      Double value,
                      BigDecimal diff) {
}
