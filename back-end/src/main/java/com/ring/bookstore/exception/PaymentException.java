package com.ring.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception class named {@link PaymentException} thrown when the payment could not be processed.
 */
@Getter
@ResponseStatus(code = HttpStatus.PAYMENT_REQUIRED)
public class PaymentException extends RuntimeException {

    private final String error;
    private String message;

    public PaymentException(String error) {
        super();
        this.error = error;
    }

    public PaymentException(String error, String message) {
        super();
        this.error = error;
        this.message = message;
    }

    public PaymentException(String error, String message, Throwable exception) {
        super(exception);
        this.error = error;
        this.message = message;
    }
}
