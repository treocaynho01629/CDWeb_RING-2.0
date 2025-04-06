package com.ring.bookstore.model.dto.response.categories;

//Category
public record PreviewCategoryDTO(Integer id,
                                 String slug,
                                 Integer parentId,
                                 String name,
                                 String image) {

}
