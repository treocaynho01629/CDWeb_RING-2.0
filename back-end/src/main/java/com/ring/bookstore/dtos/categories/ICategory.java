package com.ring.bookstore.dtos.categories;

public interface ICategory {

    Integer getId();

    String getName();

    String getSlug();

    Integer getParentId();

    String getImage();
}
