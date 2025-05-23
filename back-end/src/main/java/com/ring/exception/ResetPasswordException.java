package com.ring.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception class named {@link ResetPasswordException} thrown when password reset failed.
 */
@Getter
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class ResetPasswordException extends RuntimeException {

    public ResetPasswordException(String token, String message) {
        super(String.format("Failed for [%s]: %s", token, message));
    }
}
