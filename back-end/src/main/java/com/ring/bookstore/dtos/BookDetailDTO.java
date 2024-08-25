package com.ring.bookstore.dtos;

import java.time.LocalDate;

import com.ring.bookstore.model.Publisher;

//Book details
public record BookDetailDTO(Integer id,
		String image,
		Double price,
		String title,
		String description,
		String type,
		String author,
		String sellerName,
		Publisher publisher,
		Integer cateId,
		String cateName,
		String size,
		Integer page,
		LocalDate date,
		String language,
		Double weight,
		Integer amount,
		Integer rateTotal, 
		Integer rateAmount) {

}
