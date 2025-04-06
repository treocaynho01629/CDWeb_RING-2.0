package com.ring.bookstore.model.dto.response.dashboard;

import java.util.Map;

public record ChartDTO(String name,
                       Map<String, Long> data) {
}
