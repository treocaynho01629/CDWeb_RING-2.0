package com.ring.dto.response.books;

import com.ring.dto.response.images.ImageDTO;
import lombok.Builder;

import java.math.BigDecimal;

/**
 * Represents a book slim response as {@link BookDisplayDTO}.
 */
@Builder
public record BookDisplayDTO(Long id,
                             String slug,
                             String title,
                             ImageDTO image,
                             String description,
                             Double price,
                             BigDecimal discount,
                             Short amount,
                             Long shopId,
                             String shopName,
                             Double rating,
                             Integer totalOrders) {

}
