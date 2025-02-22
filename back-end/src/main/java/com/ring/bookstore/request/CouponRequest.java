package com.ring.bookstore.request;

import com.ring.bookstore.enums.CouponType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CouponRequest {
	
	@NotBlank(message = "Mã giảm giá không được bỏ trống!")
	@Size(min = 5, max = 50, message = "Độ dài mã từ 5-50 kí tự")
	private String code;

	@NotNull(message = "Loại mã không được bỏ trống!")
	private CouponType type;

	@Max(value = 9999, message = "Số lần sử dụng tối đa 9999")
	private Short usage;

	@Future(message = "Ngày hết hạn phải sau hôm nay!")
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDate expireDate;
	
	@NotNull(message = "Đơn vị không được bỏ trống!")
	@Min(value = 0, message = "Đơn vị tối thiểu từ 0 trở lên")
	private Double attribute;

	private Double maxDiscount;

	@DecimalMin(value = "0.0", inclusive = false)
	@Digits(integer=1, fraction=4)
	private BigDecimal discount;

	private Long shopId;
}
