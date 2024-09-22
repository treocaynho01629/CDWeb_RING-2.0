package com.ring.bookstore.exception;

import org.springframework.http.HttpStatus;

public class ImageResizerException extends Exception {

    private HttpStatus statusCode;

    public ImageResizerException(HttpStatus statusCode, String message) {
        super(message);
        this.statusCode = statusCode;
    }

    public HttpStatus getStatus() {
        return statusCode;
    }
}
