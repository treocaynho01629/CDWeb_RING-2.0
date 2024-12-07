package com.ring.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(code = HttpStatus.PRECONDITION_FAILED)
public final class ReCaptchaSuspiciousException extends RuntimeException {

    public ReCaptchaSuspiciousException() {
        super();
    }

    public ReCaptchaSuspiciousException(String message, final Throwable cause) {
        super(message, cause);
    }

    public ReCaptchaSuspiciousException(String message) {
        super(message);
    }

    public ReCaptchaSuspiciousException(Throwable cause) {
        super(cause);
    }

}
