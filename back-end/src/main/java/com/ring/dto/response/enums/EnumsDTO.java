package com.ring.dto.response.enums;

import com.ring.dto.response.dashboard.StatDTO;

import java.util.Map;

/**
 * Represents an enum response as {@link StatDTO}.
 */
public record EnumsDTO(String name, Map<String, Map<String, Object>> enums) {

}
