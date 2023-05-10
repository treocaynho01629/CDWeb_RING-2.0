package com.ring.bookstore.request;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookRequest {
	
	@NotNull(message = "Image is required")
	private String image;
	
	@NotNull(message = "Price is required")
	private Double price;
	
	@NotNull(message = "Amount is required")
	private Integer amount;
	
	@NotBlank(message = "Title is required")
	private String title;
	
	@NotBlank(message = "Description is required")
	private String description;
	
	@NotNull(message = "Type is required")
	private String type;
	
	@NotNull(message = "Author is required")
	private String author;
	
	@NotNull(message = "Publisher is required")
	private int pubId;
	
	@NotNull(message = "Category is required")
	private int cateId;
	
	@NotNull(message = "Weight is required")
	private Double weight;
	
	@NotBlank(message = "Size is required")
	private String size;
	
	@NotNull(message = "Pages is required")
	private Integer pages;
	
	@Past
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDate date;
	
	@NotBlank(message = "Language is required")
	private String language;
}
