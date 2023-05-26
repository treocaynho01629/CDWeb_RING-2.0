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
public class JwtAuthenticationFilter extends OncePerRequestFilter{ //Bộ xác thực sử dụng JWT
	
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request, 
			@NonNull HttpServletResponse response, 
			@NonNull FilterChain filterChain)
			throws ServletException, IOException {
		
		//Lấy mã authentication từ HttpRequest
		final String authHeader = request.getHeader("Authorization");
		final String jwt;
		final String userName;
		
		if (authHeader == null || !authHeader.startsWith("Bearer ")) { //Trống || không hợp lệ >> huỷ Request
			filterChain.doFilter(request, response);
			return;
		}
		
		jwt = authHeader.substring(7); //Sau "Bearer "
		
		try {
			userName = jwtService.extractUsername(jwt); //Lấy tên người dùng từ JWT
		} catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); //Không có >> báo lỗi xác thực
            response.getWriter().write(e.getMessage());
            response.getWriter().flush();
            return;
        }
		
		if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) { //Check người dùng tồn tại, và người dùng đã được cấp quyền chưa
			UserDetails userDetails = this.userDetailsService.loadUserByUsername(userName);
			
            if (jwtService.isTokenValid(jwt, userDetails)) { //Nếu JWT hợp lệ
            	
            	//Tạo quyền truy cập
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                //Gán quyền vào Security Context Holder của Spring
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
		}
		
        filterChain.doFilter(request, response);
	}

}
