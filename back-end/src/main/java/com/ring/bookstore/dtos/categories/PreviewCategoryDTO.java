package com.ring.bookstore.dtos.categories;

import java.util.List;

//Category
public record PreviewCategoryDTO(Integer id,
                                 Integer parentId,
                                 String categoryName,
                                 String image) {

}
