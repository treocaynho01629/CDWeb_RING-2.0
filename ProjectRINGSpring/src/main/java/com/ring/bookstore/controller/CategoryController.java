package com.ring.bookstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.model.Category;
import com.ring.bookstore.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
	
	private final CategoryService cateService;
	
	//Get all categories
	@GetMapping()
	public ResponseEntity<?> getAllCategories(){
		List<Category> categories =  cateService.getAllCategories();
		return new ResponseEntity< >(categories, HttpStatus.OK);
	}
}
