package com.ring.bookstore.request;

import jakarta.validation.Valid;
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
public class ShopRequest {

	@Size(max = 250, message = "Tên shop không quá 150 kí tự")
	private String name;

	@Size(max = 500, message = "Mô tả không quá 500 kí tự")
	private String description;

	private String image;

    @Valid
    @NotNull(groups = AddressRequest.class)
    private AddressRequest addressRequest;
}
