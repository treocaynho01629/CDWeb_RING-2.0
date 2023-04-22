package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.model.Category;

public interface CategoryService {
	
	List<Category> getAllCategories();
	Category getCategoryById(long id);
}
