package com.ring.bookstore.service;

import com.ring.bookstore.exception.ReCaptchaInvalidException;

public interface CaptchaService {
    default void processResponse(final String response) throws ReCaptchaInvalidException {
    }

    default void processResponse(final String response, String action) throws ReCaptchaInvalidException {
    }

    String getReCaptchaSecret();
}
