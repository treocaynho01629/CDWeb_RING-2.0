package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.categories.ICategory;
import com.ring.bookstore.model.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.entity.Category;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link CategoryRepository} for managing {@link Category} entities.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    /**
     * Retrieves a paginated list of categories based on the provided parent category ID.
     * If the parentId is null, it fetches top-level categories (categories without a parent).
     *
     * @param parentId the ID of the parent category to filter by. If null, fetches top-level categories.
     * @param pageable the pagination and sorting information.
     * @return a page of categories matching the criteria, represented as ICategory projections.
     */
    @Query("""
          select c.id as id, c.name as name, c.slug as slug, c.parent.id as parentId
          from Category c
          where case when coalesce(:parentId) is null
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """)
    Page<ICategory> findCates(Integer parentId, Pageable pageable);

    /**
     * Retrieves a list of categories based on the specified IDs, ordered by parent category ID in descending order.
     *
     * @param ids A list of category IDs to filter and retrieve the categories.
     * @return A list of categories matching the specified IDs, represented as projections of {@link ICategory}.
     */
    @Query(value = """
          select c.id as id, c.name as name, c.slug as slug, c.parent.id as parentId
          from Category c
          where c.id in :ids
          order by c.parent.id desc
    """)
    List<ICategory> findCatesWithIds(List<Integer> ids);

    /**
     * Finds categories that are either parents or subcategories of the provided parent IDs or categories whose IDs match
     * the provided parent IDs. The results are sorted by parent ID in descending order.
     *
     * @param ids a list of parent IDs or category IDs to filter the categories
     * @return a list of categories that match the provided IDs or are subcategories of the specified parent IDs
     */
    @Query(value = """
          select c.id as id, c.name as name, c.slug as slug, c.parent.id as parentId
          from Category c
          where c.parent.id in :ids
          or c.id in :ids
          order by c.parent.id desc
    """)
    List<ICategory> findParentAndSubCatesWithParentIds(List<Integer> ids);

    /**
     * Fetches a distinct page of category IDs that have the specified parent ID.
     * If the parent ID is null, it fetches categories with no parent.
     *
     * @param parentId the ID of the parent category. If null, fetches top-level categories.
     * @param pageable the pagination information.
     * @return a page of distinct category IDs.
     */
    @Query(value = """
          select distinct c.id from Category c
          where case when coalesce(:parentId) is null
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """)
    Page<Integer> findCateIdsByParent(Integer parentId, Pageable pageable);

    /**
     * Retrieves a paged list of distinct category IDs and their parent category IDs
     * that are linked to books in a specific shop.
     *
     * @param shopId The ID of the shop for which relevant categories are to be fetched.
     * @param pageable An instance of {@link Pageable} specifying pagination information.
     * @return A paged list of arrays where each array contains two elements:
     *         the category ID and its parent category ID.
     */
    @Query(value = """
          select distinct array(c.id, c.parent.id) as id from Category c
          join c.cateBooks b
          where b.shop.id = :shopId
    """)
    Page<Integer[]> findRelevantCategories(Long shopId, Pageable pageable);

    /**
     * Retrieves a list of preview categories, each including its id, slug, parent id, name,
     * and the public id of the first associated image if available.
     * This method limits the results to a maximum of 12 categories and orders them
     * by parent id in descending order with nulls first.
     *
     * @return a list of {@code ICategory} projections containing the category details along
     *         with an associated image's public id when available. The list is limited to 12 entries.
     */
    @Query("""
          select c.id as id, c.slug as slug, c.parent.id as parentId,
              c.name as name, t.image.publicId as publicId
          from Category c
          left join (
              select b.cate.id as cateId, i as image, row_number() over (partition by b.cate.id order by b.cate.id) as rn
              from Book b join b.image i
          ) t on c.id = t.cateId and t.rn = 1
          where t.image is not null
          order by c.parent.id desc nulls first
          limit 12
    """)
    List<ICategory> findPreviewCategories();

    /**
     * Retrieves a Category based on its ID or slug. If the given ID is not null, the method searches by ID.
     * Otherwise, it searches by the slug.
     *
     * @param id   the ID of the category to search for; can be null.
     * @param slug the slug of the category to search for; used if ID is null.
     * @return an {@link Optional} containing the found {@link Category} or empty if no category is found.
     */
    @Query("""
          select c from Category c
          where case when coalesce(:id) is not null
          then (c.id = :id) else (c.slug = :slug) end
    """)
    Optional<Category> findCate(Integer id, String slug);

    /**
     * Fetches a {@link Category} entity along with its child categories based on the provided ID or slug.
     * If an ID is provided, the query will match the category by ID; otherwise, it will match by slug.
     *
     * @param id the ID of the category to be fetched; can be null if fetching by slug.
     * @param slug the slug of the category to be fetched; can be null if fetching by ID.
     * @return an {@link Optional} containing the matched {@link Category} with its children if found,
     *         or an empty {@link Optional} if no category matches the given criteria.
     */
    @Query("""
          select c from Category c left join fetch c.subCates
          where case when coalesce(:id) is not null
          then (c.id = :id) else (c.slug = :slug) end
    """)
    Optional<Category> findCateWithChildren(Integer id, String slug);

    /**
     * Retrieves a category entity along with its parent category based on the provided identifier or slug.
     *
     * @param id the unique identifier of the category. If provided, this parameter will be used to find the category.
     *           Pass null if the lookup should be based on the slug instead.
     * @param slug the unique slug of the category. If provided, this parameter will be used to find the category.
     *             This will only be considered if the id parameter is null.
     * @return an {@link Optional} containing the category with its parent category, or an empty {@link Optional}
     *         if no matching category is found.
     */
    @Query("""
          select c from Category c left join fetch c.parent
          where case when coalesce(:id) is not null
          then (c.id = :id) else (c.slug = :slug) end
    """)
    Optional<Category> findCateWithParent(Integer id, String slug);

    /**
     * Retrieves a list of category IDs that match the given parent ID condition
     * and excludes the IDs provided in the input list.
     *
     * @param parentId the ID of the parent category to filter by, or null to include only root categories
     * @param ids a list of category IDs to exclude from the results
     * @return a list of category IDs that satisfy the given conditions
     */
    @Query("""
        select c.id from Category c
        where case when coalesce(:parentId) is null
        then (c.parent.id is null) else (c.parent.id = :parentId) end
        and c.id not in :ids
	""")
    List<Integer> findInverseIds(Integer parentId, List<Integer> ids);
}
