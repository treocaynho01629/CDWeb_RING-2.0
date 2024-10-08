package com.ring.bookstore.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.CategoryDTO;
import com.ring.bookstore.dtos.mappers.CategoryMapper;
import com.ring.bookstore.dtos.projections.ICategory;
import com.ring.bookstore.request.CategoryRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Category;
import com.ring.bookstore.repository.CategoryRepository;
import com.ring.bookstore.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository cateRepo;
    private final CategoryMapper cateMapper;

    //Get all categories
    public List<Category> getAllCategories() {
        return cateRepo.findAllByParentIsNull();
    }

    @Override
    public Page<Category> getCategories(Integer pageNo, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return cateRepo.findAllByParentIsNull(pageable);
    }

    @Override
    public List<CategoryDTO> getPreviewCategories() {
        List<ICategory> previews = cateRepo.findPreviewCategories();
        return previews.stream().map(cateMapper::apply).collect(Collectors.toList());
    }

    //Get category by {id}
    public Category getCategoryById(Integer id) {
        return cateRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Category not found!"));
    }

    @Override
    public Category addCategory(CategoryRequest request) {
        //Create new category
        var category = Category.builder()
                .categoryName(request.getName())
                .build();

        //Set parent
        if (request.getParentId() != null) {
            Category parent = cateRepo.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found!"));
            category.setParent(parent);
        }

        Category addedCate = cateRepo.save(category); //Save to database
        return addedCate;
    }

    @Override
    public Category updateCategory(Integer id, CategoryRequest request) {
        //Get original category
        Category category = cateRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        //Update
        category.setCategoryName(request.getName());

        //Parent
        if (request.getParentId() != null && !request.getParentId().equals(category.getParent().getId())) {
            Category parent = cateRepo.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found!"));
            category.setParent(parent);
        }

        //Update
        Category updatedCate = cateRepo.save(category);
        return updatedCate;
    }

    @Override
    public void deleteCategory(Integer id) {
        cateRepo.deleteById(id);
    }

    @Override
    public void deleteCategories(List<Integer> ids, boolean isInverse) {
        if (isInverse) {
            cateRepo.deleteByIdIsNotIn(ids);
        } else {
            cateRepo.deleteByIdIsIn(ids);
        }
    }

    @Override
    public void deleteAllCategories() {
        cateRepo.deleteAll();
    }
}
