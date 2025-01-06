package com.ring.bookstore.service.impl;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;
import java.util.function.Function;

import com.google.common.hash.Hashing;
import io.jsonwebtoken.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.web.util.WebUtils;

@Service
public class JwtService {

    //Get secret key and expire times from application.properties
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.secret-refresh-key}")
    private String secretRefreshKey;

    @Value("${application.security.jwt.expiration}")
    private long expirationTime;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpirationTime;

    //Extract username from token (First part)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject, getSignInKey(secretKey));
    }

    public String extractRefreshUsername(String token) {
        return extractClaim(token, Claims::getSubject, getSignInKey(secretRefreshKey));
    }

    public String extractCustomUsername(String token, String key) {
        //Hash the key string
        String sha256hex = Hashing.sha256()
                .hashString(key, StandardCharsets.UTF_8)
                .toString();
        return extractClaim(token, Claims::getSubject, getSignInKey(sha256hex));
    }

    //Extract claims (Second part)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver, Key key) {
        final Claims claims = extractAllClaims(token, key);
        return claimsResolver.apply(claims);
    }

    //Generate token from user
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    //Generate token with extra claims
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, expirationTime, secretKey);
    }

    //Create refresh token
    public String generateRefreshToken(UserDetails userDetails) {
        return buildCustomToken(userDetails.getUsername(), refreshExpirationTime, secretRefreshKey);
    }

    public String generateCustomToken(String username, long expTime, String key) {
        //Hash the key string
        String sha256hex = Hashing.sha256()
                .hashString(key, StandardCharsets.UTF_8)
                .toString();

        return buildCustomToken(username, expTime, sha256hex);
    }

    //Build JWT
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration,
            String key
    ) {
        //Add roles with token
        List<String> roles = new ArrayList<>();
        userDetails.getAuthorities().forEach(a -> roles.add(a.getAuthority()));
        extraClaims.put("roles", roles);

        return Jwts //Create JWT
                .builder()
                .setClaims(extraClaims) //Claims
                .setSubject(userDetails.getUsername()) //Name
                .setIssuedAt(new Date(System.currentTimeMillis())) //Create date
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) //Expiration date
                .signWith(getSignInKey(key), SignatureAlgorithm.HS256) //Encrypt
                .compact();
    }

    //Build refresh token
    private String buildCustomToken(
            String username,
            long expiration,
            String key
    ) {
        return Jwts //Create JWT
                .builder()
                .setSubject(username) //Name
                .setIssuedAt(new Date(System.currentTimeMillis())) //Create date
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) //Expiration date
                .signWith(getSignInKey(key), SignatureAlgorithm.HS256) //Encrypt
                .compact();
    }

    //JWT validation
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token); //Extract username
        return (username.equals(userDetails.getUsername()))
                && !isTokenExpired(token, secretKey); //Check expiration and valid username
    }

    public boolean isRefreshTokenValid(String token, String username) {
        final String extractedUsername = extractRefreshUsername(token); //Extract username
        return (extractedUsername.equals(username))
                && !isTokenExpired(token, secretRefreshKey); //Check expiration and valid username
    }

    public boolean isCustomTokenValid(String token, String username, String key) {
        //Hash the key string
        String sha256hex = Hashing.sha256()
                .hashString(key, StandardCharsets.UTF_8)
                .toString();
        final String extractedUsername = extractCustomUsername(token, key); //Extract username
        return (extractedUsername.equals(username))
                && !isTokenExpired(token, sha256hex); //Check expiration and valid username
    }

    public boolean validateToken(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey(secretKey))
                .build()
                .parseClaimsJws(token)
                .getBody() != null;
    }

    //Generate cookie
    public ResponseCookie generateRefreshCookie(String value) {
        return ResponseCookie
                .from("refreshToken", value)
                .path("/api/auth")
                .maxAge(refreshExpirationTime)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .build();
    }

    //Get refresh token
    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, "refreshToken");
        return cookie.getValue();
    }

    //Clear cookie
    public ResponseCookie clearRefreshCookie() {
        return ResponseCookie
                .from("refreshToken", null)
                .path("/api/auth")
                .build();
    }

    //Check JWT expired or not
    private boolean isTokenExpired(String token, String key) {
        return extractExpiration(token, getSignInKey(key)).before(new Date());
    }

    //Extract expiration time from token
    private Date extractExpiration(String token, Key key) {
        return extractClaim(token, Claims::getExpiration, key);
    }

    //Get all extra claims from token
    private Claims extractAllClaims(String token, Key key) {
        try { //Get Claims from valid token
            return Jwts
                    .parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) { //Get Claims from expired token
            return e.getClaims();
        }
    }

    //Encrypt with secret key
    private Key getSignInKey(String key) {
        byte[] keyBytes = Decoders.BASE64.decode(key);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
