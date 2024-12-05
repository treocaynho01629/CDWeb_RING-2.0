package com.ring.bookstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import lombok.RequiredArgsConstructor;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig { //Security config
	
	private final JwtAuthenticationFilter jwtAuthFilter;
	private final ChainExceptionHandlerFilter chainExceptionHandlerFilter;
	private final CorsConfigurationSource corsConfigurationSource;
	private final LogoutHandler logoutHandler;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable)
			.cors(corsConfig -> corsConfig.configurationSource(corsConfigurationSource))
	        .authorizeHttpRequests(authorize -> authorize
					.requestMatchers(HttpMethod.GET)
					.permitAll()
					.requestMatchers(
							"/api/auth/**",
							"/api/v1/**",
							"/api/books/**",
							"/api/categories/**",
							"/api/publishers/**",
							"/api/reviews/**",
							"/api/shops/**",
							"/api/coupons/**",
							"/api/banners/**",
							"/api/images/**",
							"/api/orders/calculate",
							"/v2/api-docs",
							"/v3/api-docs",
							"/v3/api-docs/**",
							"/swagger-resources",
							"/swagger-resources/**",
							"/configuration/ui",
							"/configuration/security",
							"/swagger-ui/**",
							"/webjars/**",
							"/swagger-ui.html"
					)
					.permitAll()
					.anyRequest()
					.authenticated()
			)
	        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
	        .addFilterBefore(chainExceptionHandlerFilter, JwtAuthenticationFilter.class)
	        .logout(logout -> logout
					.logoutRequestMatcher(new AntPathRequestMatcher("/api/auth/logout"))
					.addLogoutHandler(logoutHandler)
					.invalidateHttpSession(true)
					.clearAuthentication(true)
					.deleteCookies("refreshToken")
					.logoutSuccessHandler((request, response, authentication)
							-> SecurityContextHolder.clearContext())
					.permitAll()
			);
		
		return http.build();
	}
}
