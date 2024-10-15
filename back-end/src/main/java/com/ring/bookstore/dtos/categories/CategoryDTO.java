package com.ring.bookstore.dtos.categories;

import java.util.List;

//Category
public record CategoryDTO(Integer id,
                          String slug,
                          Integer parentId,
                          String categoryName,
                          CategoryDTO parent,
                          List<CategoryDTO> children) {

}
