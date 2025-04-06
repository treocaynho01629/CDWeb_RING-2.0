package com.ring.bookstore.model.dto.response.enums;

import java.util.Map;

public record EnumsDTO(String name, Map<String, Map<String, Object>> enums) {

}
