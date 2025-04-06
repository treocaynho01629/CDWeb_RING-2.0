package com.ring.bookstore.model.dto.response.dashboard;

import java.math.BigDecimal;

/**
 * Represents a stat values response as {@link StatDTO}.
 */
public record StatDTO(String id,
                      String label,
                      Double value,
                      BigDecimal diff) {
}
