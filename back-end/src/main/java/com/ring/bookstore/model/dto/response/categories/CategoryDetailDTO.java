package com.ring.bookstore.model.dto.response.categories;

import java.util.List;

//Category
public record CategoryDetailDTO(Integer id,
                                String slug,
                                String name,
                                String description,
                                Integer parentId,
                                CategoryDTO parent,
                                List<CategoryDTO> children) {
    public CategoryDetailDTO(Integer id, String slug, String name, String description, Integer parentId) {
        this(id, slug, name, description, parentId, null, null);
    }
}
