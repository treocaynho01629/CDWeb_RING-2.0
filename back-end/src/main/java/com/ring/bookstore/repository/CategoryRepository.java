package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.categories.ICategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("""
          select c.id as id, c.name as name, c.slug as slug, c.parent.id as parentId
          from Category c
          where case when coalesce(:parentId) is null
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """)
    Page<ICategory> findCates(Integer parentId, Pageable pageable);

    @Query(value = """
          select c.id as id, c.name as name, c.slug as slug, c.parent.id as parentId
          from Category c
          where c.id in :ids
          order by c.parent.id desc
    """)
    List<ICategory> findCatesWithIds(List<Integer> ids);

    @Query(value = """
          select c.id as id, c.name as name, c.slug as slug, c.parent.id as parentId
          from Category c
          where c.parent.id in :ids
          or c.id in :ids
          order by c.parent.id desc
    """)
    List<ICategory> findParentAndSubCatesWithParentIds(List<Integer> ids);

    @Query(value = """
          select distinct c.id from Category c
          where case when coalesce(:parentId) is null
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """)
    Page<Integer> findCateIdsByParent(Integer parentId, Pageable pageable);

    @Query(value = """
          select distinct array(c.id, c.parent.id) as id from Category c
          join c.cateBooks b
          where b.shop.id = :shopId
    """)
    Page<Integer[]> findRelevantCategories(Long shopId, Pageable pageable);

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

    @Query("""
          select c from Category c
          where case when coalesce(:id) is not null
          then (c.id = :id) else (c.slug = :slug) end
    """)
    Optional<Category> findCate(Integer id, String slug);

    @Query("""
          select c from Category c left join fetch c.subCates
          where case when coalesce(:id) is not null
          then (c.id = :id) else (c.slug = :slug) end
    """)
    Optional<Category> findCateWithChildren(Integer id, String slug);

    @Query("""
          select c from Category c left join fetch c.parent
          where case when coalesce(:id) is not null
          then (c.id = :id) else (c.slug = :slug) end
    """)
    Optional<Category> findCateWithParent(Integer id, String slug);

    @Query("""
        select c.id from Category c
        where case when coalesce(:parentId) is null
        then (c.parent.id is null) else (c.parent.id = :parentId) end
        and c.id not in :ids
	""")
    List<Integer> findInverseIds(Integer parentId, List<Integer> ids);
}
