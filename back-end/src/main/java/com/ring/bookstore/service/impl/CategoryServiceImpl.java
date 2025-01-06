package com.ring.bookstore.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.github.slugify.Slugify;
import com.ring.bookstore.dtos.categories.CategoryDTO;
import com.ring.bookstore.dtos.categories.CategoryDetailDTO;
import com.ring.bookstore.dtos.categories.PreviewCategoryDTO;
import com.ring.bookstore.dtos.mappers.CategoryMapper;
import com.ring.bookstore.dtos.categories.ICategory;
import com.ring.bookstore.request.CategoryRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private final Slugify slg = Slugify.builder().lowerCase(false).build();

    @Override
    public Page<CategoryDTO> getCategories(Integer pageNo, Integer pageSize, String sortBy, String sortDir,
                                           String include, Integer parentId) {
       Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());
        Page<CategoryDTO> cateDTOS = null;

        if (include != null && include.equalsIgnoreCase("children")) {
            Page<Category> catesList = cateRepo.findCatesWithChildren(parentId, pageable);
            cateDTOS = catesList.map(category -> cateMapper.cateToDTO(category, "children"));
        } else if (include != null && include.equalsIgnoreCase("parent")) {
            Page<Category> catesList = cateRepo.findCatesWithParent(parentId, pageable);
            cateDTOS = catesList.map(category -> cateMapper.cateToDTO(category, "parent"));
        } else {
            Page<Category> catesList = cateRepo.findCates(parentId, pageable);
            cateDTOS = catesList.map(cateMapper::cateToDTO);
        }
        return cateDTOS;
    }

    @Override
    public List<PreviewCategoryDTO> getPreviewCategories() {
        List<ICategory> previews = cateRepo.findPreviewCategories();
        return previews.stream().map(cateMapper::projectionToPreviewDTO).collect(Collectors.toList());
    }

    //Get category
    public CategoryDetailDTO getCategory(Integer id, String slug, String include) {
        CategoryDetailDTO result = null;

        if (include != null && include.equalsIgnoreCase("children")) {
            Category cate = cateRepo.findCateWithChildren(id, slug).orElseThrow(() ->
                    new ResourceNotFoundException("Category not found!"));
            result = cateMapper.cateToDetailDTO(cate, "children");
        } else if (include != null && include.equalsIgnoreCase("parent")) {
            Category cate = cateRepo.findCateWithParent(id, slug).orElseThrow(() ->
                    new ResourceNotFoundException("Category not found!"));
            result = cateMapper.cateToDetailDTO(cate, "parent");
        } else {
            Category cate = cateRepo.findCate(id, slug).orElseThrow(() ->
                    new ResourceNotFoundException("Category not found!"));
            result = cateMapper.cateToDetailDTO(cate);
        }

        return result;
    }

    @Transactional
    public Category addCategory(CategoryRequest request) {
        //Slugify
        String slug = slg.slugify(request.getName());

        //Create new category
        var category = Category.builder()
                .slug(slug)
                .name(request.getName())
                .description(request.getDescription())
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

    @Transactional
    public Category updateCategory(Integer id, CategoryRequest request) {
        //Get original category
        Category category = cateRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        //Set new info
        String slug = slg.slugify(request.getName());

        //Update
        category.setSlug(slug);
        category.setName(request.getName());
        category.setDescription(request.getDescription());

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

    @Transactional
    public void deleteCategory(Integer id) {
        cateRepo.deleteById(id);
    }

    @Transactional
    public void deleteCategories(Integer parentId, List<Integer> ids, Boolean isInverse) {
        List<Integer> listDelete = ids;
        if (isInverse) listDelete = cateRepo.findInverseIds(parentId, ids);
        cateRepo.deleteByIdIsIn(listDelete);
    }

    @Override
    public void deleteAllCategories() {
        cateRepo.deleteAll();
    }
}
