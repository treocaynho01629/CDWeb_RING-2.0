package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.categories.CategoryDetailDTO;
import com.ring.bookstore.dtos.categories.PreviewCategoryDTO;
import com.ring.bookstore.model.Category;
import com.ring.bookstore.request.CategoryRequest;
import org.springframework.data.domain.Page;

public interface CategoryService {

    Page<CategoryDTO> getCategories(Integer pageNo,
                                    Integer pageSize,
                                    String sortBy,
                                    String sortDir,
                                    String include,
                                    Integer parentId);

    List<PreviewCategoryDTO> getPreviewCategories();

    CategoryDetailDTO getCategory(Integer id,
                                  String slug,
                                  String include);

    Category addCategory(CategoryRequest request);

    Category updateCategory(Integer id,
                            CategoryRequest request);

    void deleteCategory(Integer id);

    void deleteCategories(Integer parentId,
                          List<Integer> ids,
                          Boolean isInverse);

    void deleteAllCategories();
}
