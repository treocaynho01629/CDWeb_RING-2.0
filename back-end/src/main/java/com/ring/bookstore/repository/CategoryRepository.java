package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.projections.ICategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findAllByParentIsNull();

    @Query("""
              select c from Category c
              where case when coalesce(:parentId) is null 
              then (c.parent.id is null) else (c.parent.id = :parentId) end
            """)
    Page<Category> findAllCates(Integer parentId, Pageable pageable);

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
    Page<Category> findAllCatesWithChildren(Integer parentId, Pageable pageable);

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
    Page<Category> findAllCatesWithParent(Integer parentId, Pageable pageable);

    @Query("""
              select c.id as id, c.parent.id as parentId, c.categoryName as name, t.image as image
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

    void deleteByIdIsIn(List<Integer> ids);

    void deleteByIdIsNotIn(List<Integer> ids);
}
