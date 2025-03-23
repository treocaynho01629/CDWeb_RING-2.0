package com.ring.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(code = HttpStatus.EXPECTATION_FAILED)
public class ImageUploadException extends RuntimeException {

    private final String error;
    private String message;

    public ImageUploadException(String error) {
        super();
        this.error = error;
    }

    public ImageUploadException(String error, String message) {
        super();
        this.error = error;
        this.message = message;
    }

    public ImageUploadException(String error, Throwable exception) {
        super(exception);
        this.error = error;
        this.message = this.getLocalizedMessage();
    }

    public ImageUploadException(String error, String message, Throwable exception) {
        super(exception);
        this.error = error;
        this.message = message;
    }
}
