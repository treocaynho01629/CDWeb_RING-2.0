package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.categories.CategoryDetailDTO;
import com.ring.bookstore.dtos.categories.PreviewCategoryDTO;
import com.ring.bookstore.dtos.categories.ICategory;
import com.ring.bookstore.model.Category;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CategoryMapper {

    public CategoryDTO projectionToDTO(ICategory category) {
        return new CategoryDTO(category.getId(),
                category.getSlug(),
                category.getName(),
                category.getParentId());
    }

    public CategoryDTO projectionToDTO(Category category) {
        return new CategoryDTO(category.getId(),
                category.getSlug(),
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : null);
    }

    public List<CategoryDTO> parendAndChildsToCateDTOS(List<ICategory> all, List<Integer> orderedIds) {
        Map<Integer, CategoryDTO> catesMap = new LinkedHashMap<>();
        Collections.reverse(all);

        for (ICategory projection : all) {
            if (projection.getParentId() == null) {
                var newCate = CategoryDTO.builder().id(projection.getId())
                        .name(projection.getName())
                        .slug(projection.getSlug())
                        .parentId(projection.getParentId())
                        .children(new ArrayList<>())
                        .build();

                catesMap.put(newCate.id(), newCate);
            } else {
                var newChild = CategoryDTO.builder().id(projection.getId())
                        .name(projection.getName())
                        .slug(projection.getSlug())
                        .parentId(projection.getParentId())
                        .build();
                catesMap.get(projection.getParentId()).children().add(newChild);
            }

        }

        //Reordered to list
        List<CategoryDTO> result = new ArrayList<>();
        for (Integer id : orderedIds) {
            if (catesMap.containsKey(id)) {
                result.add(catesMap.get(id));
            }
        }
        return result;
    }

    public CategoryDTO cateToDTO(Category category, String include) {
        List<CategoryDTO> children = null;
        CategoryDTO parent = null;
        Category parentCate = category.getParent();

        //Include?
        if (include == null) return this.projectionToDTO(category);
        if (include.equalsIgnoreCase("parent")) {
            parent = parentCate != null ? this.cateToDTO(parentCate, "parent") : null;
        } else if (include.equalsIgnoreCase("children")) {
            children = category.getSubCates()
                    .stream()
                    .sorted(Comparator.comparingInt(Category::getId))
                    .map(this::projectionToDTO).collect(Collectors.toList());
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
        if (include.equalsIgnoreCase("parent")) {
            parent = parentCate != null ? this.cateToDTO(parentCate, "parent") : null;
        } else if (include.equalsIgnoreCase("children")) {
            children = category.getSubCates()
                    .stream()
                    .sorted(Comparator.comparingInt(Category::getId))
                    .map(this::projectionToDTO).collect(Collectors.toList());
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
        String fileDownloadUri = projection.getImage() != null ?
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/images/")
                        .path(projection.getImage())
                        .toUriString()
                : null;

        return new PreviewCategoryDTO(projection.getId(),
                projection.getSlug(),
                projection.getParentId(),
                projection.getName(),
                fileDownloadUri);
    }
}
