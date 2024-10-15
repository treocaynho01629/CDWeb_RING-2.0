package com.ring.bookstore.dtos.categories;

import java.util.List;

//Category
public record CategoryDetailDTO(Integer id,
                                String slug,
                                Integer parentId,
                                String categoryName,
                                String description,
                                CategoryDTO parent,
                                List<CategoryDTO> children) {

}
