package com.ring.bookstore.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest { //Request body for review
	
	@NotBlank(message = "Nội dung đánh giá không bỏ trống!")
	@Size(min = 50, message = "Nội dung tối thiểu 50 kí tự!")
	private String content;

	@NotNull(message = "Đánh giá không bỏ trống!")
	@Range(min = 1, max = 5, message = "Đánh giá phải từ 1 đến 5 sao")
	private Integer rating;
}
