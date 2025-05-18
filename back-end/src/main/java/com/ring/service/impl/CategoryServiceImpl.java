package com.ring.service.impl;

import com.github.slugify.Slugify;
import com.ring.dto.projection.categories.ICategory;
import com.ring.dto.request.CategoryRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.categories.CategoryDTO;
import com.ring.dto.response.categories.CategoryDetailDTO;
import com.ring.dto.response.categories.PreviewCategoryDTO;
import com.ring.exception.HttpResponseException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.mapper.CategoryMapper;
import com.ring.model.entity.Category;
import com.ring.repository.CategoryRepository;
import com.ring.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository cateRepo;
    private final CategoryMapper cateMapper;
    private final Slugify slg = Slugify.builder().lowerCase(false).build();

    @Cacheable(cacheNames = "categories")
    public PagingResponse<CategoryDTO> getCategories(Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir,
            String include,
            Integer parentId) {

        Pageable pageable = PageRequest.of(pageNo, pageSize,
                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        if (include != null && include.equalsIgnoreCase("children")) {
            Page<Integer> pagedIds = cateRepo.findCateIdsByParent(parentId, pageable);
            List<Integer> cateIds = pagedIds.getContent();
            List<ICategory> fullList = cateRepo.findParentAndSubCatesWithParentIds(cateIds);

            // Map
            List<CategoryDTO> catesList = cateMapper.parentAndChildToCateDTOS(fullList);

            // Sort by parent ids
            Map<Integer, Integer> idOrder = new HashMap<>();
            for (int i = 0; i < cateIds.size(); i++)
                idOrder.put(cateIds.get(i), i);
            catesList.sort(Comparator.comparingInt(c -> idOrder.get(c.id())));

            return new PagingResponse<>(
                    catesList,
                    pagedIds.getTotalPages(),
                    pagedIds.getTotalElements(),
                    pagedIds.getSize(),
                    pagedIds.getNumber(),
                    pagedIds.isEmpty());
        } else {
            Page<ICategory> catesList = cateRepo.findCates(parentId, pageable);
            List<CategoryDTO> cateDTOS = catesList.map(cateMapper::projectionToDTO).toList();
            return new PagingResponse<>(
                    cateDTOS,
                    catesList.getTotalPages(),
                    catesList.getTotalElements(),
                    catesList.getSize(),
                    catesList.getNumber(),
                    catesList.isEmpty());
        }
    }

    @Cacheable(cacheNames = "categories")
    public PagingResponse<CategoryDTO> getRelevantCategories(Integer pageNo,
            Integer pageSize,
            Long shopId) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("id").descending());

        Page<Integer[]> cateIds = cateRepo.findRelevantCategories(shopId, pageable);

        // Joined id & parent id
        LinkedHashSet<Integer> joinedIdsSet = new LinkedHashSet<>();
        for (Integer[] arr : cateIds.getContent()) {
            joinedIdsSet.add(arr[0]);
            joinedIdsSet.add(arr[1]);
        }
        List<Integer> joinedIds = new ArrayList<>(joinedIdsSet.stream().toList());
        List<ICategory> fullList = cateRepo.findCatesWithIds(joinedIds);

        // Map
        List<CategoryDTO> catesList = cateMapper.parentAndChildToCateDTOS(fullList);

        // Sort by parent ids
        Map<Integer, Integer> idOrder = new HashMap<>();
        for (int i = 0; i < joinedIds.size(); i++)
            idOrder.put(joinedIds.get(i), i);
        catesList.sort(Comparator.comparingInt(c -> idOrder.get(c.id())));

        return new PagingResponse<>(
                catesList,
                cateIds.getTotalPages(),
                cateIds.getTotalElements(),
                cateIds.getSize(),
                cateIds.getNumber(),
                cateIds.isEmpty());
    }

    @Cacheable(cacheNames = "previewCategories")
    public List<PreviewCategoryDTO> getPreviewCategories() {
        List<ICategory> previews = cateRepo.findPreviewCategories();
        return previews.stream().map(cateMapper::projectionToPreviewDTO).collect(Collectors.toList());
    }

    @Cacheable(cacheNames = "categoryDetail")
    public CategoryDetailDTO getCategory(Integer id, String slug, String include) {
        CategoryDetailDTO result = null;

        if (include != null && include.equalsIgnoreCase("children")) {
            Category cate = cateRepo.findCateWithChildren(id, slug)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found!",
                            "Không tìm thấy danh mục yêu cầu!"));
            result = cateMapper.cateToDetailDTO(cate, "children");
        } else if (include != null && include.equalsIgnoreCase("parent")) {
            Category cate = cateRepo.findCateWithParent(id, slug)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found!",
                            "Không tìm thấy danh mục yêu cầu!"));
            result = cateMapper.cateToDetailDTO(cate, "parent");
        } else {
            Category cate = cateRepo.findCate(id, slug)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found!",
                            "Không tìm thấy danh mục yêu cầu!"));
            result = cateMapper.cateToDetailDTO(cate);
        }

        return result;
    }

    @CacheEvict(cacheNames = { "categories", "previewCategories" }, allEntries = true)
    @Transactional
    public Category addCategory(CategoryRequest request) {

        // Slugify
        String slug = slg.slugify(request.getName());

        // Create new category
        var category = Category.builder()
                .slug(slug)
                .name(request.getName())
                .description(request.getDescription())
                .build();

        // Set parent
        if (request.getParentId() != null) {
            Category parent = cateRepo.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found!",
                            "Không tìm thấy danh mục yêu cầu!"));
            if (parent.getParent() != null)
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid parent category!");
            category.setParent(parent);
        }

        Category addedCate = cateRepo.save(category); // Save to database
        return addedCate;
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "categories", "previewCategories" }, allEntries = true),
            @CacheEvict(cacheNames = "categoryDetail", key = "#id") })
    @Transactional
    public Category updateCategory(Integer id, CategoryRequest request) {
        // Get original category
        Category category = cateRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found!",
                        "Không tìm thấy danh mục yêu cầu!"));

        // Set new info
        String slug = slg.slugify(request.getName());

        // Update
        category.setSlug(slug);
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        // Parent
        if (request.getParentId() != null
                && (category.getParent() == null || !request.getParentId().equals(category.getParent().getId()))) {
            if (!category.getSubCates().isEmpty())
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid child category!");
            Category parent = cateRepo.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found!",
                            "Không tìm thấy danh mục yêu cầu!"));
            if (parent.getParent() != null)
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid parent category!");
            category.setParent(parent);
        }

        // Update
        Category updatedCate = cateRepo.save(category);
        return updatedCate;
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "categories", "previewCategories" }, allEntries = true),
            @CacheEvict(cacheNames = "categoryDetail", key = "#id") })
    @Transactional
    public void deleteCategory(Integer id) {
        cateRepo.deleteById(id);
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "categories", "previewCategories" }, allEntries = true) })
    @Transactional
    public void deleteCategories(List<Integer> ids) {
        cateRepo.deleteAllByIdInBatch(ids);
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "categories", "previewCategories" }, allEntries = true) })
    @Transactional
    public void deleteCategoriesInverse(Integer parentId, List<Integer> ids) {
        List<Integer> listDelete = cateRepo.findInverseIds(parentId, ids);
        cateRepo.deleteAllByIdInBatch(listDelete);
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "categories", "previewCategories" }, allEntries = true) })
    @Transactional
    public void deleteAllCategories() {
        cateRepo.deleteAll();
    }
}
