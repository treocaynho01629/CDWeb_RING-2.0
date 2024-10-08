package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.CategoryDTO;
import com.ring.bookstore.dtos.projections.ICategory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.function.Function;

@Service
public class CategoryMapper implements Function<ICategory, CategoryDTO> {

    @Override
    public CategoryDTO apply(ICategory category) {

        String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(category.getImage())
                .toUriString();

        return new CategoryDTO(category.getId(),
                category.getName(),
                fileDownloadUri);
    }
}
