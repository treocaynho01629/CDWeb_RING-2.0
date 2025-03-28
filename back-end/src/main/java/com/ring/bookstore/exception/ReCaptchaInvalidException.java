package com.ring.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public final class ReCaptchaInvalidException extends RuntimeException {

    public ReCaptchaInvalidException() {
        super();
    }

    public ReCaptchaInvalidException(String message, final Throwable cause) {
        super(message, cause);
    }

    public ReCaptchaInvalidException(String message) {
        super(message);
    }

    public ReCaptchaInvalidException(Throwable cause) {
        super(cause);
    }

}
