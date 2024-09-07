package com.ring.bookstore.repository;

import java.util.List;
import java.util.Optional;

import com.ring.bookstore.dtos.projections.IImageInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer>{

	@Query("""
    	select i.name as name, i.type as type from Image i
    	where i.parent is null
    """)
	List<IImageInfo> findAllWithoutData();
	Optional<Image> findByName(String name); //Get image by {name}
	boolean existsByName(String name); //Check exist image with {name}
}
