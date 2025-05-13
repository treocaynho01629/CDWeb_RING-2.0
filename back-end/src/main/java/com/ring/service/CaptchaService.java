package com.ring.service;


import com.ring.exception.ReCaptchaInvalidException;

public interface CaptchaService {

    void validate(final String recaptchaToken,
                  String source,
                  String action) throws ReCaptchaInvalidException;

}
