package com.ring.bookstore.dtos.categories;

import java.util.List;

//Category
public record CategoryDTO(Integer id,
                          Integer parentId,
                          String categoryName,
                          String description,
                          List<CategoryDTO> ancestor,
                          List<CategoryDTO> children,
                          String image) {

}
