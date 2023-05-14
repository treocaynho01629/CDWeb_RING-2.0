package com.ring.bookstore.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
	
	@NotBlank(message = "Content is required")
	private String content;

	@NotNull(message = "Rating is required")
	private Integer rating;
}
