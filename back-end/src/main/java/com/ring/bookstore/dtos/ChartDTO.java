package com.ring.bookstore.dtos;

import java.util.Map;

public record ChartDTO(String name,
                       Map<String, Long> data) {
}
