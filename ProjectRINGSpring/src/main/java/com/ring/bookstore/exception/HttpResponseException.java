package com.ring.bookstore.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class HttpResponseException extends RuntimeException {

	private static final long serialVersionUID = -6593330219878485669L;

	private final HttpStatus status;
	private final String message;

	public HttpResponseException(HttpStatus status, String message) {
		super();
		this.status = status;
		this.message = message;
	}

	public HttpResponseException(HttpStatus status, String message, Throwable exception) {
		super(exception);
		this.status = status;
		this.message = message;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public String getMessage() {
		return message;
	}

}
