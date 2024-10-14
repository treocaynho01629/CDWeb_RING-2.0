package com.ring.bookstore.dtos.projections;

public interface ICategory {

    Integer getId();

    Integer getParentId();

    String getName();

    String getDescription();

    String getImage();
}
