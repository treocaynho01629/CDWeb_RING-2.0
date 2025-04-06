package com.ring.bookstore.config.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration class named {@link TokenSettings} for token parameters used in authentication and authorization.
*/
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "application.security.jwt")
public class TokenSettings {

    private String secretKey;
    private String secretRefreshKey;
    private long tokenExpiration; // Minutes
    private long refreshTokenExpiration; // Days

}
