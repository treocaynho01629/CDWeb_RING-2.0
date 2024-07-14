package com.ring.bookstore.service.impl;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	
	//Get secret key and expire times from application.properties
	@Value("${application.security.jwt.secret-key}")
	private String secretKey;
	@Value("${application.security.jwt.expiration}")
	private long expirationTime;
	@Value("${application.security.jwt.refresh-token.expiration}")
	private long refreshExpirationTime;
	
	//Extract username from token (First part)
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	//Extract claims (Second part)
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	
	//Generate token from user
	public String generateToken(UserDetails userDetails) {
		return generateToken(new HashMap<>(), userDetails);
	}
	
	//Generate token with extra claims
	public String generateToken(
			Map<String, Object> extraClaims,
	        UserDetails userDetails
	) {
	   return buildToken(extraClaims, userDetails, expirationTime);
	}
	
	//Create refresh token
	public String generateRefreshToken(
	        UserDetails userDetails
	) {
	   return buildToken(new HashMap<>(), userDetails, refreshExpirationTime);
	}
	
	//Build JWT
	private String buildToken(
			Map<String, Object> extraClaims,
	        UserDetails userDetails,
	        long expiration
    ) {
		 return Jwts //Create JWT
		            .builder()
		            .setClaims(extraClaims) //Extra claims
		            .setSubject(userDetails.getUsername()) //Name
		            .setIssuedAt(new Date(System.currentTimeMillis())) //Create date
		            .setExpiration(new Date(System.currentTimeMillis() + expiration)) //Expiration date
		            .signWith(getSignInKey(), SignatureAlgorithm.HS256) //Encrypt
		            .compact();
	}
	
	//JWT validation
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String userName = extractUsername(token); //Extract name
		return (userName.equals(userDetails.getUsername())) && !isTokenExpired(token); //Check expiration and valid username
	}
	
	//Check JWT expired or not
	private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
	
	//Extract expiration time from token
	private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
	
	//Get all extra claims from token
	private Claims extractAllClaims(String token) {
		return Jwts
				.parserBuilder()
				.setSigningKey(getSignInKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	//Encrypt with secret key
	private Key getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
	}
}
