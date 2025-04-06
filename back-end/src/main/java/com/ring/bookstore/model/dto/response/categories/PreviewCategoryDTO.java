package com.ring.bookstore.model.dto.response.categories;

/**
 * Represents a preview category response as {@link PreviewCategoryDTO}.
 */
public record PreviewCategoryDTO(Integer id,
                                 String slug,
                                 Integer parentId,
                                 String name,
                                 String image) {

}
