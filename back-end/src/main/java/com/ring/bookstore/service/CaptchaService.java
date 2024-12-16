package com.ring.bookstore.service;


import com.ring.bookstore.exception.ReCaptchaInvalidException;

public interface CaptchaService {
    void validate(final String recaptchaToken,
                  String source,
                  String action) throws ReCaptchaInvalidException;
}
