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
          select c from Category c
          where case when coalesce(:parentId) is null 
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """)
    Page<Category> findCates(Integer parentId, Pageable pageable);

    @Query(value = """
          select c from Category c left join fetch c.subCates
          where case when coalesce(:parentId) is null 
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """,
    countQuery = """
          select count(c) from Category c
          where case when coalesce(:parentId) is null 
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """)
    Page<Category> findCatesWithChildren(Integer parentId, Pageable pageable);

    @Query(value = """
          select c from Category c left join fetch c.parent
          where case when coalesce(:parentId) is null 
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """,
    countQuery = """
          select count(c) from Category c
          where case when coalesce(:parentId) is null 
          then (c.parent.id is null) else (c.parent.id = :parentId) end
    """)
    Page<Category> findCatesWithParent(Integer parentId, Pageable pageable);

    @Query("""
          select c as category, t.image as image
          from Category c
          left join (
              select b.cate.id as cateId, i.name as image, row_number() over (partition by b.cate.id order by b.cate.id) as rn
              from Book b join Image i on b.image.id = i.id
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
        where (coalesce(:parentId) is null or c.parent.id = :parentId)
              and c.id not in :ids
	""")
    List<Integer> findInverseIds(Integer parentId, List<Integer> ids);

    @Query("""
        delete from Category c
        where size(c.subCates) = 0 and c.id in :ids
	""")
    void deleteByIdIsIn(List<Integer> ids);

}
