package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.categories.PreviewCategoryDTO;
import com.ring.bookstore.dtos.projections.ICategory;
import com.ring.bookstore.model.Category;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryMapper {

    public CategoryDTO cateToCateDTO(Category category) {
        Category parentCate = category.getParent();

        return new CategoryDTO(category.getId(),
                parentCate != null ? parentCate.getId() : null,
                category.getCategoryName(),
                null,
                null);
    }

    public CategoryDTO cateToCateDTOWithChildren(Category category) {
        List<CategoryDTO> children = category.getSubCates()
                .stream().map(this::cateToCateDTO).collect(Collectors.toList());
        Category parentCate = category.getParent();

        return new CategoryDTO(category.getId(),
                parentCate != null ? parentCate.getId() : null,
                category.getCategoryName(),
                null,
                children);
    }

    public CategoryDTO cateToCateDTOWithParent(Category category) {
        Category parentCate = category.getParent();
        CategoryDTO parent = parentCate != null ? this.cateToCateDTOWithParent(category.getParent()) : null;

        return new CategoryDTO(category.getId(),
                parentCate != null ? parentCate.getId() : null,
                category.getCategoryName(),
                parent,
                null);
    }

    public PreviewCategoryDTO projectionToPreview(ICategory category) {

        String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(category.getImage())
                .toUriString();

        return new PreviewCategoryDTO(category.getId(),
                category.getParentId(),
                category.getName(),
                fileDownloadUri);
    }
}
