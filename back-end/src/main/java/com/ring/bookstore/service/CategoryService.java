package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.model.dto.response.categories.CategoryDTO;
import com.ring.bookstore.model.dto.response.categories.CategoryDetailDTO;
import com.ring.bookstore.model.dto.response.categories.PreviewCategoryDTO;
import com.ring.bookstore.model.entity.Category;
import com.ring.bookstore.model.dto.request.CategoryRequest;
import com.ring.bookstore.model.dto.response.PagingResponse;

public interface CategoryService {

    PagingResponse<CategoryDTO> getCategories(Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir,
            String include,
            Integer parentId);

    PagingResponse<CategoryDTO> getRelevantCategories(Integer pageNo,
            Integer pageSize,
            Long shopId);

    List<PreviewCategoryDTO> getPreviewCategories();

    CategoryDetailDTO getCategory(Integer id,
            String slug,
            String include);

    Category addCategory(CategoryRequest request);

    Category updateCategory(Integer id,
            CategoryRequest request);

    void deleteCategory(Integer id);

    void deleteCategories(List<Integer> ids);

    void deleteCategoriesInverse(Integer parentId,
            List<Integer> ids);

    void deleteAllCategories();
}
