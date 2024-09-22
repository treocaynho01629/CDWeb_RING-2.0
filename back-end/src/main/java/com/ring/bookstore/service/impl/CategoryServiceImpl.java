package com.ring.bookstore.service.impl;

import java.util.List;

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

    //Get all categories
    public List<Category> getAllCategories() {
        return cateRepo.findAllByParentIsNull();
    }

    //Get category by {id}
    public Category getCategoryById(Integer id) {
        return cateRepo.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Category not found!"));
    }
}
