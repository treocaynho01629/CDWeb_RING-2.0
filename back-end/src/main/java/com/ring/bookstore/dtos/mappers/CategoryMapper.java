package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.categories.CategoryDetailDTO;
import com.ring.bookstore.dtos.categories.PreviewCategoryDTO;
import com.ring.bookstore.dtos.categories.ICategory;
import com.ring.bookstore.model.Category;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryMapper {

    public CategoryDTO cateToDTO(Category category) {
        return new CategoryDTO(category.getId(),
                category.getSlug(),
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : null);
    }

    public CategoryDTO cateToDTO(Category category, String include) {
        List<CategoryDTO> children = null;
        CategoryDTO parent = null;
        Category parentCate = category.getParent();

        //Include?
        if (include == null) return this.cateToDTO(category);
        if (include.equalsIgnoreCase("parent")){
            parent = parentCate != null ? this.cateToDTO(parentCate, "parent") : null;
        } else if (include.equalsIgnoreCase("children")) {
            children = category.getSubCates()
                    .stream()
                    .sorted(Comparator.comparingInt(Category::getId))
                    .map(this::cateToDTO).collect(Collectors.toList());
        }

        return new CategoryDTO(category.getId(),
                category.getSlug(),
                category.getName(),
                parentCate != null ? parentCate.getId() : null,
                parent,
                children);
    }

    public CategoryDetailDTO cateToDetailDTO(Category category) {
        return new CategoryDetailDTO(category.getId(),
                category.getSlug(),
                category.getName(),
                category.getDescription(),
                category.getParent() != null ? category.getParent().getId() : null);
    }

    public CategoryDetailDTO cateToDetailDTO(Category category, String include) {
        List<CategoryDTO> children = null;
        CategoryDTO parent = null;
        Category parentCate = category.getParent();

        //Include?
        if (include == null) return this.cateToDetailDTO(category);
        if (include.equalsIgnoreCase("parent")){
            parent = parentCate != null ? this.cateToDTO(parentCate, "parent") : null;
        } else if (include.equalsIgnoreCase("children")) {
            children = category.getSubCates()
                    .stream()
                    .sorted(Comparator.comparingInt(Category::getId))
                    .map(this::cateToDTO).collect(Collectors.toList());
        }

        return new CategoryDetailDTO(category.getId(),
                category.getSlug(),
                category.getName(),
                category.getDescription(),
                parentCate != null ? parentCate.getId() : null,
                parent,
                children);
    }

    public PreviewCategoryDTO projectionToPreviewDTO(ICategory projection) {
        Category category = projection.getCategory();

        String fileDownloadUri = projection.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(projection.getImage())
                        .toUriString()
                : null;

        return new PreviewCategoryDTO(category.getId(),
                category.getSlug(),
                category.getParent() != null ? category.getParent().getId() : null,
                category.getName(),
                fileDownloadUri);
    }
}
