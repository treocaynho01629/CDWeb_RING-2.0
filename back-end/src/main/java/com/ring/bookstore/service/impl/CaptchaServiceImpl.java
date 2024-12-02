package com.ring.bookstore.service.impl;

import java.net.URI;
import java.util.regex.Pattern;

import com.ring.bookstore.config.CaptchaSettings;
import com.ring.bookstore.exception.ReCaptchaInvalidException;
import com.ring.bookstore.service.CaptchaService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestOperations;

@RequiredArgsConstructor
@Service
public class CaptchaServiceImpl implements CaptchaService {

    protected final HttpServletRequest request;
    protected final CaptchaSettings captchaSettings;
    protected final CaptchaProtectionService captchaAttemptService;
    protected final RestOperations restTemplate;

    protected static final Pattern RESPONSE_PATTERN = Pattern.compile("[A-Za-z0-9_-]+");

    @Value("${google.recaptcha.secret}")
    private String secretKey;

    @Value("${google.recaptcha.url}")
    private String verifyUrl;

//    public void processResponse(String response, final String action) throws ReCaptchaInvalidException {
//        securityCheck(response);
//
//        final URI verifyUri = URI.create(String.format(RECAPTCHA_URL_TEMPLATE, getReCaptchaSecret(), response, getClientIP()));
//        try {
//            final GoogleResponse googleResponse = restTemplate.getForObject(verifyUri, GoogleResponse.class);
//            LOGGER.debug("Google's response: {} ", googleResponse.toString());
//
//            if (!googleResponse.isSuccess() || !googleResponse.getAction().equals(action) || googleResponse.getScore() < captchaSettings.getThreshold()) {
//                if (googleResponse.hasClientError()) {
//                    reCaptchaAttemptService.reCaptchaFailed(getClientIP());
//                }
//                throw new ReCaptchaInvalidException("reCaptcha was not successfully validated");
//            }
//        } catch (RestClientException rce) {
//            throw new ReCaptchaUnavailableException("Registration unavailable at this time.  Please try again later.", rce);
//        }
//        reCaptchaAttemptService.reCaptchaSucceeded(getClientIP());
//    }

    @Override
    public String getReCaptchaSecret() {
        return captchaSettings.getSecret();
    }

    protected void securityCheck(final String response) {
        if (captchaAttemptService.isBlocked(getClientIP())) {
            throw new ReCaptchaInvalidException("Client exceeded maximum number of failed attempts!");
        }

        if (!responseSanityCheck(response)) {
            throw new ReCaptchaInvalidException("Response contains invalid characters!");
        }
    }

    protected boolean responseSanityCheck(final String response) {
        return StringUtils.hasLength(response) && RESPONSE_PATTERN.matcher(response).matches();
    }

    protected String getClientIP() {
        final String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || !xfHeader.contains(request.getRemoteAddr())) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
