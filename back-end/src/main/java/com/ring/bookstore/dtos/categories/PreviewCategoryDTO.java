package com.ring.bookstore.dtos.categories;

//Category
public record PreviewCategoryDTO(Integer id,
                                 String slug,
                                 Integer parentId,
                                 String categoryName,
                                 String image) {

}
