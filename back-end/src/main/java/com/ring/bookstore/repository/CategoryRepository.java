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
public interface CategoryRepository extends JpaRepository<Category, Integer>{
    List<Category> findAllByParentIsNull();

	Page<Category> findAllByParentIsNull(Pageable pageable);

    @Query("""
      select c.id as id, c.categoryName as name, t.image as image
      from Category c
      left join (
          select b.cate.id as cateId, i.name as image, row_number() over (partition by b.cate.id order by b.cate.id) as rn
          from Book b join Image i on b.image.id = i.id
      ) t on c.id = t.cateId and t.rn = 1
      where t.image is not null
      order by c.id
      limit 10
    """)
    List<ICategory> findPreviewCategories();

	void deleteByIdIsIn(List<Integer> ids);

	void deleteByIdIsNotIn(List<Integer> ids);
}
