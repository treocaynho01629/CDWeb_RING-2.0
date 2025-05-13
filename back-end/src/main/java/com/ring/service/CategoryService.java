package com.ring.service;

import com.ring.dto.request.CategoryRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.categories.CategoryDTO;
import com.ring.dto.response.categories.CategoryDetailDTO;
import com.ring.dto.response.categories.PreviewCategoryDTO;
import com.ring.model.entity.Category;

import java.util.List;

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
