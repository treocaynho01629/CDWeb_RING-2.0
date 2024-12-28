package com.ring.bookstore.dtos.dashboard;

import java.math.BigDecimal;

public record StatDTO(String id,
                      String label,
                      Double value,
                      BigDecimal diff) {
}
