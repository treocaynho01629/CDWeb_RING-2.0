package com.ring.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception class named {@link ImageResizerException} thrown when resizing image failed.
 */
@Getter
@ResponseStatus(code = HttpStatus.EXPECTATION_FAILED)
public class ImageResizerException extends Exception {

    private final String error;
    private String message;

    public ImageResizerException(String error) {
        super();
        this.error = error;
    }

    public ImageResizerException(String error, String message) {
        super();
        this.error = error;
        this.message = message;
    }

    public ImageResizerException(String error, Throwable exception) {
        super(exception);
        this.error = error;
        this.message = this.getLocalizedMessage();
    }

    public ImageResizerException(String error, String message, Throwable exception) {
        super(exception);
        this.error = error;
        this.message = message;
    }
}
