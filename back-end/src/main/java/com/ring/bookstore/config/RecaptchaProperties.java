package com.ring.bookstore.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "google.recaptcha")
public record RecaptchaProperties(String secret, String url, double threshold) {
}
