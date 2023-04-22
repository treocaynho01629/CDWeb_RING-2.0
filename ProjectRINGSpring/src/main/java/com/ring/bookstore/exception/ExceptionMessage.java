package com.ring.bookstore.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExceptionMessage {
    private int code;
    private String message;
    private Map<String, String> errors;
}
