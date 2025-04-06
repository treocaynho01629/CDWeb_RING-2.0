package com.ring.bookstore.model.dto.response.categories;

public interface ICategory {

    Integer getId();

    String getName();

    String getSlug();

    Integer getParentId();

    String getPublicId();
}
