package com.ring.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.Serial;

/**
 * Exception class named {@link HttpResponseException} for generic exception.
 */
@Getter
public class HttpResponseException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = -6593330219878485669L;

	private final HttpStatus status;
	private final String error;
	private String message;

	public HttpResponseException(HttpStatus status, String error) {
		super();
		this.status = status;
		this.error = error;
	}

	public HttpResponseException(HttpStatus status, String error, String message) {
		super();
		this.status = status;
		this.error = error;
		this.message = message;
	}

	public HttpResponseException(HttpStatus status, String error, Throwable exception) {
		super(exception);
		this.status = status;
		this.error = error;
		this.message = this.getLocalizedMessage();
	}

	public HttpResponseException(HttpStatus status, String error, String message, Throwable exception) {
		super(exception);
		this.status = status;
		this.error = error;
		this.message = message;
	}
}
