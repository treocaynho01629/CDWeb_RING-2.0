package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.dtos.CategoryDTO;
import com.ring.bookstore.model.Category;
import com.ring.bookstore.request.CategoryRequest;
import org.springframework.data.domain.Page;

public interface CategoryService {

    List<Category> getAllCategories();

    Page<Category> getCategories(Integer pageNo, Integer pageSize);

    List<CategoryDTO> getPreviewCategories();

    Category getCategoryById(Integer id);

    Category addCategory(CategoryRequest request);

    Category updateCategory(Integer id, CategoryRequest request);

    void deleteCategory(Integer id);

    void deleteCategories(List<Integer> ids, boolean isInverse);

    void deleteAllCategories();
}
