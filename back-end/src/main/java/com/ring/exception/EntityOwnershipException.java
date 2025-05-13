package com.ring.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception class named {@link EntityOwnershipException} thrown when the specified resource is not own by the current user.
 */
@Getter
@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class EntityOwnershipException extends RuntimeException {

    private final String error;
    private String message;

    public EntityOwnershipException(String error) {
        super();
        this.error = error;
    }

    public EntityOwnershipException(String error, String message) {
        super();
        this.error = error;
        this.message = message;
    }
}
