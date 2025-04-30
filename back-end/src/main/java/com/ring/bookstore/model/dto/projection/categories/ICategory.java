package com.ring.bookstore.model.dto.projection.categories;

/**
 * Represents a category projection as {@link ICategory}, containing the category's ID,
 * name, slug, parent ID, and image's publicID.
 */
public interface ICategory {

    Integer getId();

    String getName();

    String getSlug();

    Integer getParentId();

    String getPublicId();
}
