package com.ring.bookstore.dtos.categories;

import java.util.List;

//Category
public record CategoryDTO(Integer id,
                          String slug,
                          String name,
                          Integer parentId,
                          CategoryDTO parent,
                          List<CategoryDTO> children) {
    public CategoryDTO(Integer id, String name) {
        this(id, null, name, null, null, null);
    }

    public CategoryDTO(Integer id, String slug, String name, Integer parentId) {
        this(id, slug, name, parentId, null, null);
    }

    public CategoryDTO(Integer id, String slug, String name, Integer parentId, CategoryDTO parent) {
        this(id, slug, name, parentId, parent, null);
    }
}
