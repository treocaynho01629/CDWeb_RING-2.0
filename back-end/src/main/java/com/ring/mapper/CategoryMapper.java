package com.ring.mapper;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.dto.projection.categories.ICategory;
import com.ring.dto.response.categories.CategoryDTO;
import com.ring.dto.response.categories.CategoryDetailDTO;
import com.ring.dto.response.categories.PreviewCategoryDTO;
import com.ring.model.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CategoryMapper {

    private final Cloudinary cloudinary;

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

    public List<CategoryDTO> parentAndChildToCateDTOS(List<ICategory> all) {
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

        //Convert & return
        List<CategoryDTO> result = new ArrayList<CategoryDTO>(catesMap.values());
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
        String url = cloudinary.url().transformation(new Transformation()
                        .aspectRatio("1.0")
                        .width(70)
                        .quality("auto")
                        .fetchFormat("auto"))
                .secure(true).generate(projection.getPublicId());

        return new PreviewCategoryDTO(projection.getId(),
                projection.getSlug(),
                projection.getParentId(),
                projection.getName(),
                url);
    }
}
