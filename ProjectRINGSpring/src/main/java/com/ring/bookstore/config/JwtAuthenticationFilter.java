package com.ring.bookstore.config;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ring.bookstore.service.impl.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{ //JWT authen
	
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request, 
			@NonNull HttpServletResponse response, 
			@NonNull FilterChain filterChain)
			throws ServletException, IOException {
		
		//Get bearer authentication from HttpRequest
		final String authHeader = request.getHeader("Authorization");
		final String jwt;
		final String userName;
		
		if (authHeader == null || !authHeader.startsWith("Bearer ")) { //Null || not Bearer >> cancel
			filterChain.doFilter(request, response);
			return;
		}
		
		jwt = authHeader.substring(7); //After "Bearer "
		
		try {
			userName = jwtService.extractUsername(jwt); //Extract username from JWT
		} catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); //Not exists >> throw error
            response.getWriter().write(e.getMessage());
            response.getWriter().flush();
            return;
        }
		
		if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) { //Check user exists or not & their roles
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(userName);
			
            if (jwtService.isTokenValid(jwt, userDetails)) { //Check valid JWT
            	
            	//Create auth token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                //Add created auth token to Security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
		}
		
        filterChain.doFilter(request, response);
	}

}
