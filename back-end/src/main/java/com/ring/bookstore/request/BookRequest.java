package com.ring.bookstore.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.ring.bookstore.enums.BookType;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookRequest { //Request body for book
	
	@NotNull(message = "Giá không được bỏ trống!")
	@Min(value = 1000, message = "Giá từ 1.000 ₫")
	@Max(value = 10000000, message = "Giá dưới 10.000.000 ₫")
	private Double price;

	@DecimalMin(value = "0.0", inclusive = false)
	@Digits(integer=1, fraction=4)
	private BigDecimal discount;

	@NotNull(message = "Số lượng không được bỏ trống!")
	@Min(value = 1, message = "Số lượng phải từ 1")
	@Max(value = 10000, message = "Tối đa 10.000")
	private Short amount;
	
	@NotBlank(message = "Tiêu đề không được bỏ trống!")
	private String title;
	
	@NotBlank(message = "Mô tả không được bỏ trống!")
	private String description;
	
	@NotNull(message = "Hình thức bìa không được bỏ trống!")
	private BookType type;
	
	@NotNull(message = "Tác giả không được bỏ trống!")
	private String author;
	
	@NotNull(message = "NXB không được bỏ trống!")
	private Integer pubId;
	
	@NotNull(message = "Danh mục không được bỏ trống!")
	private Integer cateId;
	
	@NotNull(message = "Trọng lượng không được bỏ trống!")
	@Min(value = 1, message = "Trọng lượng phải trên 1g")
	private Double weight;
	
	@NotBlank(message = "Kích cỡ không được bỏ trống!")
	private String size;
	
	@NotNull(message = "Số trang không được bỏ trống!")
	@Min(value = 1, message = "Số trang phải trên 1")
	private Integer pages;
	
	@Past(message = "Ngày xuất bản phải trước hôm nay!")
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	private LocalDate date;
	
	@NotBlank(message = "Ngôn ngữ không được bỏ trống!")
	private String language;

	@NotNull(message = "Cửa hàng không được bỏ trống!")
	private Long shopId;

	private Long thumbnailId;

	private List<Long> removeIds;
}
