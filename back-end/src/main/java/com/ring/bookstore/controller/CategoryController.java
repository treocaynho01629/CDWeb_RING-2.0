package com.ring.bookstore.controller;

import java.util.List;

import com.ring.bookstore.model.dto.response.categories.PreviewCategoryDTO;
import com.ring.bookstore.model.dto.request.CategoryRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.service.CategoryService;

import lombok.RequiredArgsConstructor;

/**
 * Controller named {@link CategoryController} for handling category-related operations.
 * Exposes endpoints under "/api/categories".
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService cateService;

    /**
     * Retrieves preview categories for quick selection.
     *
     * @return a {@link ResponseEntity} containing a list of preview categories.
     */
    @GetMapping("/preview")
    public ResponseEntity<?> getPreviewCategories() {
        List<PreviewCategoryDTO> categories = cateService.getPreviewCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    /**
     * Retrieves categories relevant to a specific shop.
     *
     * @param pageSize  size of each page.
     * @param pageNo    page number.
     * @param shopId    ID of the shop.
     * @return a {@link ResponseEntity} containing relevant categories.
     */
    @GetMapping("/relevant/{id}")
    public ResponseEntity<?> getRelevantCategories(@RequestParam(value = "pSize", defaultValue = "20") Integer pageSize,
                                                   @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                                   @PathVariable("id") Long shopId) {
        return new ResponseEntity<>(cateService.getRelevantCategories(pageNo, pageSize, shopId), HttpStatus.OK);
    }

    /**
     * Retrieves all categories with pagination, sorting, and optional filters.
     *
     * @param pageSize  size of each page.
     * @param pageNo    page number.
     * @param sortBy    sorting field.
     * @param sortDir   sorting direction.
     * @param include   optional field to include "parent" or "children".
     * @param parentId  optional parent category ID to filter by.
     * @return a {@link ResponseEntity} containing paginated categories.
     */
    @GetMapping
    public ResponseEntity<?> getCategories(@RequestParam(value = "pSize", defaultValue = "20") Integer pageSize,
                                           @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                           @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                           @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
                                           @RequestParam(value = "include", required = false) String include,
                                           @RequestParam(value = "parentId", required = false) Integer parentId) {
        return new ResponseEntity<>(cateService.getCategories(pageNo, pageSize, sortBy, sortDir, include, parentId), HttpStatus.OK);
    }

    /**
     * Retrieves a category by its ID.
     *
     * @param id the category ID.
     * @param include optional field to include "parent" or "children".
     * @return a {@link ResponseEntity} containing the category.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable("id") Integer id,
                                             @RequestParam(value = "include", required = false) String include) {
        return new ResponseEntity<>(cateService.getCategory(id, null, include), HttpStatus.OK);
    }

    /**
     * Retrieves a category by its slug.
     *
     * @param slug the slug of the category.
     * @param include optional field to include "parent" or "children".
     * @return a {@link ResponseEntity} containing the category.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getCategoryBySlug(@PathVariable("slug") String slug,
                                             @RequestParam(value = "include", required = false) String include) {
        return new ResponseEntity<>(cateService.getCategory(null, slug, include), HttpStatus.OK);
    }

    /**
     * Creates a new category.
     *
     * @param request the {@link CategoryRequest} containing category data.
     * @return a {@link ResponseEntity} containing the created category.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('create:category')")
    public ResponseEntity<?> createCategory(@Valid @RequestPart("request") CategoryRequest request) {
        return new ResponseEntity<>(cateService.addCategory(request), HttpStatus.CREATED);
    }

    /**
     * Updates a category by its ID.
     *
     * @param id the ID of the category to update.
     * @param request the updated category data.
     * @return a {@link ResponseEntity} containing the updated category.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('update:category')")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Integer id,
                                            @Valid @RequestPart("request") CategoryRequest request) {
        return new ResponseEntity<>(cateService.updateCategory(id, request), HttpStatus.CREATED);
    }

    /**
     * Deletes a category by its ID.
     *
     * @param id the ID of the category to delete.
     * @return a {@link ResponseEntity} with a success message.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:category')")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer id) {
        cateService.deleteCategory(id);
        return new ResponseEntity<>("Category deleted!", HttpStatus.OK);
    }

    /**
     * Deletes multiple categories by a list of IDs.
     *
     * @param ids list of category IDs to delete.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-multiple")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:category')")
    public ResponseEntity<?> deleteCategories(@RequestParam(value = "parentId", required = false) Integer parentId,
                                              @RequestParam("ids") List<Integer> ids
    ) {
        cateService.deleteCategories(ids);
        return new ResponseEntity<>("Categories deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes categories that are NOT in the given list of IDs.
     *
     * @param ids list of IDs to exclude from deletion.
     * @param parentId optional parent category ID to filter by.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:book')")
    public ResponseEntity<?> deleteCategoriesInverse(@RequestParam(value = "parentId", required = false) Integer parentId,
                                                     @RequestParam("ids") List<Integer> ids) {
        cateService.deleteCategoriesInverse(parentId, ids);
        return new ResponseEntity<>("Categories deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes all categories in the system.
     *
     * @return a {@link ResponseEntity} with a success message.
     */
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:category')")
    public ResponseEntity<?> deleteAllCategories() {
        cateService.deleteAllCategories();
        return new ResponseEntity<>("All categories deleted successfully!", HttpStatus.OK);
    }
}
