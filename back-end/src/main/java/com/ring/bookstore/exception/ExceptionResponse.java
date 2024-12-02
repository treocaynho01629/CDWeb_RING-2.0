package com.ring.bookstore.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class ExceptionResponse {
    private int status;
    private String error;
    private Map<String, String> errors;
    private String message;

    public ExceptionResponse(int status, String error) {
        this.status = status;
        this.error = error;
    }

    public ExceptionResponse(int status, String error, String message) {
        this.status = status;
        this.error = error;
        this.message = message;
    }
}
