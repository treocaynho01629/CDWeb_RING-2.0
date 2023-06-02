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
	
	//Lấy Secret key, Hạng sử dụng JWT từ file Properties
	@Value("${application.security.jwt.secret-key}")
	private String secretKey;
	@Value("${application.security.jwt.expiration}")
	private long expirationTime;
	@Value("${application.security.jwt.refresh-token.expiration}")
	private long refreshExpirationTime;
	
	//Lấy tên người dùng từ JWT (Phần đầu)
	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	//Lấy dữ liệu claim kèm từ JWT (Phần giữa)
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	
	//Tạo JWT mới từ Dữ liệu người dùng
	public String generateToken(UserDetails userDetails) {
		return generateToken(new HashMap<>(), userDetails);
	}
	
	//Tạo JWT với Dữ liệu kèm (extraClaims)
	public String generateToken(
			Map<String, Object> extraClaims,
	        UserDetails userDetails
	) {
	   return buildToken(extraClaims, userDetails, expirationTime);
	}
	
	//Tạo Refresh Token
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
		 return Jwts //Tạo JWT
		            .builder()
		            .setClaims(extraClaims) //Dữ liệu kèm
		            .setSubject(userDetails.getUsername()) //Tên người dùng
		            .setIssuedAt(new Date(System.currentTimeMillis())) //Ngày tạo
		            .setExpiration(new Date(System.currentTimeMillis() + expiration)) //Ngày hết hạn
		            .signWith(getSignInKey(), SignatureAlgorithm.HS256) //Mã hoá với key
		            .compact();
	}
	
	//Kiểm tra JWT có hợp lệ không
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String userName = extractUsername(token); //Lấy tên người dùng từ JWT
		return (userName.equals(userDetails.getUsername())) && !isTokenExpired(token); //Tên hợp lê? và JWT hết hạn chưa ?
	}
	
	//Check JWT hết hạn chưa
	private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
	
	//Lấy ngày hết hạn từ JWT
	private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
	
	//Lấy thông tin kèm từ JWT
	private Claims extractAllClaims(String token) {
		return Jwts
				.parserBuilder()
				.setSigningKey(getSignInKey()) //Kiểm tra token sử dụng signinkey
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	//Giải mã Secret key
	private Key getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
	}
}
