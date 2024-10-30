package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.categories.CategoryDetailDTO;
import com.ring.bookstore.dtos.categories.PreviewCategoryDTO;
import com.ring.bookstore.dtos.projections.ICategory;
import com.ring.bookstore.model.Category;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryMapper {

    public CategoryDTO cateToCateDTO(Category category) {
        return new CategoryDTO(category.getId(),
                category.getSlug(),
                category.getParentId(),
                category.getCategoryName(),
                null,
                null);
    }

    public CategoryDTO cateToCateDTO(Category category, String include) {
        List<CategoryDTO> children = null;
        CategoryDTO parent = null;

        //Include?
        if (include == null) return this.cateToCateDTO(category);
        if (include.equalsIgnoreCase("parent")){
            Category parentCate = category.getParent();
            parent = parentCate != null ? this.cateToCateDTO(category.getParent(), "parent") : null;
        } else if (include.equalsIgnoreCase("children")) {
            children = category.getSubCates()
                    .stream()
                    .sorted(Comparator.comparingInt(Category::getId))
                    .map(this::cateToCateDTO).collect(Collectors.toList());
        }

        return new CategoryDTO(category.getId(),
                category.getSlug(),
                category.getParentId(),
                category.getCategoryName(),
                parent,
                children);
    }

    public CategoryDetailDTO cateToDetailDTO(Category category) {
        return new CategoryDetailDTO(category.getId(),
                category.getSlug(),
                category.getParentId(),
                category.getCategoryName(),
                category.getDescription(),
                null,
                null);
    }

    public CategoryDetailDTO cateToDetailDTO(Category category, String include) {
        List<CategoryDTO> children = null;
        CategoryDTO parent = null;

        //Include?
        if (include == null) return this.cateToDetailDTO(category);
        if (include.equalsIgnoreCase("parent")){
            Category parentCate = category.getParent();
            parent = parentCate != null ? this.cateToCateDTO(category.getParent(), "parent") : null;
        } else if (include.equalsIgnoreCase("children")) {
            children = category.getSubCates()
                    .stream()
                    .sorted(Comparator.comparingInt(Category::getId))
                    .map(this::cateToCateDTO).collect(Collectors.toList());
        }

        return new CategoryDetailDTO(category.getId(),
                category.getSlug(),
                category.getParentId(),
                category.getCategoryName(),
                category.getDescription(),
                parent,
                children);
    }

    public PreviewCategoryDTO projectionToPreview(ICategory projection) {
        Category category = projection.getCategory();

        String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(projection.getImage())
                .toUriString();

        return new PreviewCategoryDTO(category.getId(),
                category.getSlug(),
                category.getParentId(),
                category.getCategoryName(),
                fileDownloadUri);
    }
}
