package com.ring.dto.response.categories;

import lombok.Builder;

/**
 * Represents a preview category response as {@link PreviewCategoryDTO}.
 */
@Builder
public record PreviewCategoryDTO(Integer id,
                                 String slug,
                                 Integer parentId,
                                 String name,
                                 String image) {

}
