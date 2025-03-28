package com.ring.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class ResetPasswordException extends RuntimeException {

    public ResetPasswordException(String token, String message) {
        super(String.format("Failed for [%s]: %s", token, message));
    }
}
