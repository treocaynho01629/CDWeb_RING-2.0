package com.ring.bookstore.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "google.recaptcha.key")
public class CaptchaSettings {

    //reCAPTCHA V3
    private String secret;
    private float threshold;

    public CaptchaSettings() {
    }
}
