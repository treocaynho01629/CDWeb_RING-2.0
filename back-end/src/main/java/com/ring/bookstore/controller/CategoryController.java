package com.ring.bookstore.controller;

import java.util.List;

import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.categories.PreviewCategoryDTO;
import com.ring.bookstore.request.CategoryRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/all")
    public ResponseEntity<?> getAllCategories() {
        List<Category> categories = cateService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    //Get preview categories
    @GetMapping("/preview")
    public ResponseEntity<?> getPreviewCategories() {
        List<PreviewCategoryDTO> categories = cateService.getPreviewCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    //Get categories
    @GetMapping
    public ResponseEntity<?> getCategories(@RequestParam(value = "include", required = false) String include,
                                           @RequestParam(value = "parentId", required = false) Integer parentId,
                                           @RequestParam(value = "pSize", defaultValue = "10") Integer pageSize,
                                           @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo) {
        return new ResponseEntity<>(cateService.getCategories(include, parentId, pageNo, pageSize), HttpStatus.OK);
    }

    //Get category by {id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(cateService.getCategoryById(id, "test"), HttpStatus.OK);
    }

    //Add category
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestPart("request") CategoryRequest request) {
        return new ResponseEntity<>(cateService.addCategory(request), HttpStatus.CREATED);
    }

    //Update category by id
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Integer id,
                                            @Valid @RequestPart("request") CategoryRequest request) {
        return new ResponseEntity<>(cateService.updateCategory(id, request), HttpStatus.CREATED);
    }

    //Delete category
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer id) {
        return new ResponseEntity<>("Category deleted!", HttpStatus.OK);
    }

    //Delete multiples categories in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategories(@RequestParam("ids") List<Integer> ids,
                                              @RequestParam(value = "isInverse", defaultValue = "false") Boolean isInverse
    ) {
        cateService.deleteCategories(ids, isInverse);
        return new ResponseEntity<>("Categories deleted successfully!", HttpStatus.OK);
    }

    //Delete all categories
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAllCategories() {
        cateService.deleteAllCategories();
        return new ResponseEntity<>("All categories deleted successfully!", HttpStatus.OK);
    }
}
