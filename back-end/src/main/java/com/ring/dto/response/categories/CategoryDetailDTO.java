package com.ring.dto.response.categories;

import java.util.List;

/**
 * Represents a category detail response as {@link CategoryDetailDTO}.
 */
public record CategoryDetailDTO(Integer id,
                                String slug,
                                String name,
                                String description,
                                Integer parentId,
                                CategoryDTO parent,
                                List<CategoryDTO> children) {

    public CategoryDetailDTO(Integer id,
                             String slug,
                             String name,
                             String description,
                             Integer parentId) {
        this(id, slug, name, description, parentId, null, null);
    }
}
