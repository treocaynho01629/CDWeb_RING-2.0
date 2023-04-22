package com.ring.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{

}
