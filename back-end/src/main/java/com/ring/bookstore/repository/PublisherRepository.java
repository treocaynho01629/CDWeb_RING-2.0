package com.ring.bookstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Publisher;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Integer>{
	@Query("select b.id from Publisher b")
	List<Integer> findAllIds();
}
