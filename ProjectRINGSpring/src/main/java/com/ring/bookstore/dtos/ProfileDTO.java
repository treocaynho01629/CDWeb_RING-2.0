package com.ring.bookstore.dtos;

import java.time.LocalDate;

//Hồ sơ Người dùng
public record ProfileDTO(String userName, String email, String name, String phone, String gender, LocalDate dob, String address) {

}
