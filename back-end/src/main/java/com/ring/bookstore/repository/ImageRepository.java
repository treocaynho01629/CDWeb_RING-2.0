package com.ring.bookstore.repository;

import java.util.Optional;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer>{
	@Transactional
	
	Optional<Image> findByName(String name); //Get image by {name}
	boolean existsByName(String name); //Check exist image with {name}
}
