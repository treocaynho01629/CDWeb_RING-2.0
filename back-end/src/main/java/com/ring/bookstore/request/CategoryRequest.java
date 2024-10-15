package com.ring.bookstore.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequest {
	
	@NotBlank(message = "Tên danh mục không được bỏ trống!")
	@Size(min = 1, max = 50, message = "Tên danh mục dài từ 1-50 kí tự!")
	private String name;

	private Integer parentId;

	@Size(max = 500, message = "Mô tả không quá 500 kí tự")
	private String description;
}
