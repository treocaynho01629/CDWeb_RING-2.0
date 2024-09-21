package com.ring.bookstore.config;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
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
public class JwtAuthenticationFilter extends OncePerRequestFilter { //JWT authen

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RequestMatcher ignoredPaths = new AntPathRequestMatcher("/api/v1/auth/**");

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        //Ignore some paths
        if (this.ignoredPaths.matches(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        //Get bearer authentication from HttpRequest
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) { //Null || not Bearer >> cancel
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7); //After "Bearer "
        try {
            username = jwtService.extractUsername(jwt); //Extract username from JWT
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); //Not exists >> throw error
            response.getWriter().write(e.getMessage());
            response.getWriter().flush();
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) { //Check user exists or not & their roles
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) { //Check valid JWT
                //Create auth token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //Add created auth token to Security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }

}
