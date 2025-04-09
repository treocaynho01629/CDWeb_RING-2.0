package com.ring.bookstore.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a publisher request as {@link PublisherRequest}.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PublisherRequest {
	
	@NotBlank(message = "Tên nhà xuất bản không được bỏ trống!")
	@Size(min = 1, max = 50, message = "Tên nhà xuất bản dài từ 1-50 kí tự!")
	private String name;

}
