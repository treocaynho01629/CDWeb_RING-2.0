package com.ring.bookstore.service.impl;

import java.security.Key;
import java.util.*;
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
	@Value("${application.security.jwt.secret-refresh-key}")
	private String secretRefreshKey;
	@Value("${application.security.jwt.expiration}")
	private long expirationTime;
	@Value("${application.security.jwt.refresh-token.expiration}")
	private long refreshExpirationTime;
	
	//Extract username from token (First part)
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject, getSignInKey());
	}

	public String extractRefreshUsername(String token) {
		return extractClaim(token, Claims::getSubject, getRefreshSignInKey());
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
	public String generateToken(
			Map<String, Object> extraClaims,
	        UserDetails userDetails
	) {
	   return buildToken(extraClaims, userDetails, expirationTime, getSignInKey());
	}
	
	//Create refresh token
	public String generateRefreshToken(
	        UserDetails userDetails
	) {
	   return buildToken(new HashMap<>(), userDetails, refreshExpirationTime, getRefreshSignInKey());
	}
	
	//Build JWT
	private String buildToken(
			Map<String, Object> extraClaims,
	        UserDetails userDetails,
	        long expiration,
			Key key
    ) {
		//Add roles with token
		List<String> roles = new ArrayList<>();
		Map<String, Object> rolesClaim = new HashMap<>();
		userDetails.getAuthorities().forEach(a -> roles.add(a.getAuthority()));
		rolesClaim.put("roles", roles);

		 return Jwts //Create JWT
		            .builder()
		            .setClaims(extraClaims) //Extra claims
		            .setSubject(userDetails.getUsername()) //Name
		            .setIssuedAt(new Date(System.currentTimeMillis())) //Create date
		            .setExpiration(new Date(System.currentTimeMillis() + expiration)) //Expiration date
		            .signWith(key, SignatureAlgorithm.HS256) //Encrypt
				 	.addClaims(rolesClaim) //Roles
		            .compact();
	}
	
	//JWT validation
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token); //Extract name
		return (username.equals(userDetails.getUsername())) && !isTokenExpired(token, getSignInKey()); //Check expiration and valid username
	}

	public boolean isRefreshTokenValid(String token, UserDetails userDetails) {
		final String username = extractRefreshUsername(token); //Extract refresh username
		return (username.equals(userDetails.getUsername())) && !isTokenExpired(token, getRefreshSignInKey()); //Check expiration and valid username
	}
	
	//Check JWT expired or not
	private boolean isTokenExpired(String token, Key key) {
        return extractExpiration(token, key).before(new Date());
    }

	//Extract expiration time from token
	private Date extractExpiration(String token, Key key) {
        return extractClaim(token, Claims::getExpiration, key);
    }

	//Get all extra claims from token
	private Claims extractAllClaims(String token, Key key) {
		return Jwts
				.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	//Encrypt with secret key
	private Key getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
	}

	private Key getRefreshSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretRefreshKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
