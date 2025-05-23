package com.ring.config.captcha;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration class named {@link CaptchaSettings} for reCAPTCHA parameters
 * used in validating reCAPTCHA.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "google.recaptcha")
public class CaptchaSettings {

    private String secret;
    private String v3Secret;
    private String url;
    private float threshold;
    private float suspicious;

}
