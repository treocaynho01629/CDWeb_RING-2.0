package com.ring.bookstore.dtos.dashboard;

import java.util.Map;

public record ChartDTO(String name,
                       Map<String, Long> data) {
}
