package com.ring.bookstore.dtos;

import java.time.LocalDate;

//Account details
public record AccountDetailDTO(Long id,
		String userName,
		String email,
		Integer roles,
		String name,
		String phone,
		String gender,
		String address,
		LocalDate dob) {

}
