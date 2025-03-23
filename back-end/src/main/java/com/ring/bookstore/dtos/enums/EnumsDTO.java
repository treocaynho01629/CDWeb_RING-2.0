package com.ring.bookstore.dtos.enums;

import java.util.Map;

public record EnumsDTO(String name, Map<String, Map<String, Object>> enums) {

}
