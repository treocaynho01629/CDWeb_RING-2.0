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
public class ReviewRequest { //Request body for review
	
	@NotBlank(message = "Nội dung đánh giá không bỏ trống!")
	private String content;

	@NotNull(message = "Đánh giá không bỏ trống!")
	private Integer rating;
}
