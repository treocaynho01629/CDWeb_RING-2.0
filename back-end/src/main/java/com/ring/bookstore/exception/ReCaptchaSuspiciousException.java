package com.ring.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception class named {@link ReCaptchaInvalidException} thrown when the reCAPTCHA validation is suspicious.
 */
@Getter
@ResponseStatus(code = HttpStatus.PRECONDITION_FAILED)
public final class ReCaptchaSuspiciousException extends RuntimeException {

    public ReCaptchaSuspiciousException(String message) {
        super(message);
    }

}
