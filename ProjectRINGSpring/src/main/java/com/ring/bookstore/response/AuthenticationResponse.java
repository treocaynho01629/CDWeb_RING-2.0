package com.ring.bookstore.response;

import java.util.Set;

import com.ring.bookstore.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse { //Response after authentication

	private String token;
	private String refreshToken;
	private Set<Role> roles;
}
