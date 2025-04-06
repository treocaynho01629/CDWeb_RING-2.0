package com.ring.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception class named {@link ReCaptchaInvalidException} thrown when the reCAPTCHA validation failed.
 */
@Getter
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public final class ReCaptchaInvalidException extends RuntimeException {

    public ReCaptchaInvalidException(String message, final Throwable cause) {
        super(message, cause);
    }

    public ReCaptchaInvalidException(String message) {
        super(message);
    }

}
