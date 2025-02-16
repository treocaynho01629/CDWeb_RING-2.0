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
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService cateService;

    //Get preview categories
    @GetMapping("/preview")
    public ResponseEntity<?> getPreviewCategories() {
        List<PreviewCategoryDTO> categories = cateService.getPreviewCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    //Get categories
    @GetMapping
    public ResponseEntity<?> getCategories(@RequestParam(value = "pSize", defaultValue = "20") Integer pageSize,
                                           @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                           @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                           @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
                                           @RequestParam(value = "include", required = false) String include,
                                           @RequestParam(value = "parentId", required = false) Integer parentId) {
        return new ResponseEntity<>(cateService.getCategories(pageNo, pageSize, sortBy, sortDir, include, parentId), HttpStatus.OK);
    }

    //Get category by {id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable("id") Integer id,
                                             @RequestParam(value = "include", required = false) String include) {
        return new ResponseEntity<>(cateService.getCategory(id, null, include), HttpStatus.OK);
    }

    //Get category by {slug}
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getCategoryBySlug(@PathVariable("slug") String slug,
                                             @RequestParam(value = "include", required = false) String include) {
        return new ResponseEntity<>(cateService.getCategory(null, slug, include), HttpStatus.OK);
    }

    //Add category
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestPart("request") CategoryRequest request) {
        return new ResponseEntity<>(cateService.addCategory(request), HttpStatus.CREATED);
    }

    //Update category by id
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Integer id,
                                            @Valid @RequestPart("request") CategoryRequest request) {
        return new ResponseEntity<>(cateService.updateCategory(id, request), HttpStatus.CREATED);
    }

    //Delete category
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer id) {
        cateService.deleteCategory(id);
        return new ResponseEntity<>("Category deleted!", HttpStatus.OK);
    }

    //Delete multiples categories in a lists of {ids}
    @DeleteMapping("/delete-multiples")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteCategories(@RequestParam(value = "parentId", required = false) Integer parentId,
                                              @RequestParam("ids") List<Integer> ids,
                                              @RequestParam(value = "isInverse", defaultValue = "false") Boolean isInverse
    ) {
        cateService.deleteCategories(parentId, ids, isInverse);
        return new ResponseEntity<>("Categories deleted successfully!", HttpStatus.OK);
    }

    //Delete all categories
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteAllCategories() {
        cateService.deleteAllCategories();
        return new ResponseEntity<>("All categories deleted successfully!", HttpStatus.OK);
    }
}
