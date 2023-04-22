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
	
	@Value("${application.security.jwt.secret-key}")
	private String secretKey;
	@Value("${application.security.jwt.expiration}")
	private long expirationTime;
	@Value("${application.security.jwt.refresh-token.expiration}")
	private long refreshExpirationTime;
	
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	
	public String generateToken(UserDetails userDetails) {
		return generateToken(new HashMap<>(), userDetails);
	}
	
	public String generateToken(
			Map<String, Object> extraClaims,
	        UserDetails userDetails
	) {
	   return buildToken(extraClaims, userDetails, expirationTime);
	}
	
	public String generateRefreshToken(
	        UserDetails userDetails
	) {
	   return buildToken(new HashMap<>(), userDetails, refreshExpirationTime);
	}
	
	private String buildToken(
			Map<String, Object> extraClaims,
	        UserDetails userDetails,
	        long expiration
    ) {
		 return Jwts
		            .builder()
		            .setClaims(extraClaims)
		            .setSubject(userDetails.getUsername())
		            .setIssuedAt(new Date(System.currentTimeMillis()))
		            .setExpiration(new Date(System.currentTimeMillis() + expiration))
		            .signWith(getSignInKey(), SignatureAlgorithm.HS256)
		            .compact();
	}
	
	//Check token còn dùng được ko
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String userName = extractUsername(token);
		return (userName.equals(userDetails.getUsername())) && !isTokenExpired(token);
	}
	
	//Check hạn của token
	private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
	
	private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
	
	private Claims extractAllClaims(String token) {
		return Jwts
				.parserBuilder()
				.setSigningKey(getSignInKey()) //key để mã hoá
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	//giải mã key
	private Key getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
	}
}
