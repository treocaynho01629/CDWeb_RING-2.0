package com.ring.bookstore.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
	@Size(min = 1, max = 5, message = "Đánh giá từ 1 đến 5 sao")
	private Integer rating;
}
