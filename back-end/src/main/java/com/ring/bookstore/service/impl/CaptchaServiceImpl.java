package com.ring.bookstore.service.impl;

import com.ring.bookstore.config.captcha.CaptchaSettings;
import com.ring.bookstore.exception.ReCaptchaInvalidException;
import com.ring.bookstore.response.RecaptchaResponse;
import com.ring.bookstore.service.CaptchaService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
@Service
public class CaptchaServiceImpl implements CaptchaService {

    private final Logger log = LoggerFactory.getLogger(getClass());

    protected final HttpServletRequest request;
    protected final CaptchaSettings captchaSettings;
    protected final CaptchaProtectionService captchaProtectionService;
    protected final RestTemplate restTemplate;

    public static final String LOGIN_ACTION = "login";
    public static final String REGISTER_ACTION = "register";
    public static final String FORGOT_ACTION = "forgot";
    public static final String RESET_ACTION = "reset";

    public void validate(String recaptchaToken, final String action) throws ReCaptchaInvalidException {
        if (captchaProtectionService.isBlocked(getClientIP())) {
            throw new ReCaptchaInvalidException("Client exceeded maximum number of failed attempts!");
        }

        //Validate
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("secret", captchaSettings.getSecret());
        map.add("response", recaptchaToken);

        ResponseEntity<RecaptchaResponse> responseEntity = null;
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(map, headers);

        try {
            responseEntity = restTemplate.exchange(
                    captchaSettings.getUrl(),
                    HttpMethod.POST,
                    httpEntity,
                    RecaptchaResponse.class
            );

            RecaptchaResponse recaptchaResponse = responseEntity.getBody();
            log.debug("reCaptcha response: {} ", recaptchaResponse.toString());

            if (!recaptchaResponse.isSuccess() || !recaptchaResponse.getAction().equals(action)
                    || recaptchaResponse.getScore() < captchaSettings.getThreshold()) {
                if (recaptchaResponse.hasClientError()) { //Protect against bad request attempts
                    captchaProtectionService.captchaFailed(getClientIP());
                }
                throw new ReCaptchaInvalidException("reCaptcha detected unusual behavior!");
            }
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            throw new ReCaptchaInvalidException("Service unavailable at this time.  Please try again later!", e);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ReCaptchaInvalidException("reCaptcha was not successfully validated!", e);
        }

        captchaProtectionService.captchaSucceeded(getClientIP());
    }

    protected String getClientIP() {
        final String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || !xfHeader.contains(request.getRemoteAddr())) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
