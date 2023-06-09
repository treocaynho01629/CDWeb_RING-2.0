package com.ring.bookstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer>{
	
	Optional<Image> findByName(String name); //Lấy Ảnh theo {Tên}
	boolean existsByName(String name); //Kiểm tra Ảnh với {Tên} đã tồn tại ?
}
