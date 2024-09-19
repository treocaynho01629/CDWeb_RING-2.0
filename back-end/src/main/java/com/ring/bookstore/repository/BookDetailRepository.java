package com.ring.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.BookDetail;

@Repository
public interface BookDetailRepository extends JpaRepository<BookDetail, Long>{

}
