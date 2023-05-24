package com.ring.bookstore.dtos;

import java.time.LocalDate;

public record AccountDetailDTO(Integer id,
		String userName,
		String email,
		Integer roles,
		String name,
		String phone,
		String gender,
		String address,
		LocalDate dob) {

}
