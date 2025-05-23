package com.ring.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a banner request as {@link BannerRequest}.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BannerRequest {
	
	@NotBlank(message = "Tên banner không được bỏ trống!")
	@Size(min = 5, max = 200, message = "Tên banner từ 5-200 kí tự")
	private String name;

	@Size(max = 4000, message = "Độ dài mô tả từ tối đa 4000 kí tự")
	private String description;

	@NotBlank(message = "Đường dẫn không bỏ trống!")
	private String url;

	private Long shopId;
}
