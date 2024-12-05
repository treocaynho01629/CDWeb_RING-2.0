package com.ring.bookstore.repository;

import java.util.List;
import java.util.Optional;

import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.dtos.images.IImageInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query("""
        select i.name as name, i.type as type from Image i
        where i.parent is null
    """)
    List<IImageInfo> findAllInfo();

    @Query("""
        select i.name as name, i.type as type from AccountProfile p
        join p.image i
        where p.id = :id
    """)
    Optional<IImageInfo> findInfoByProfileId(Long id);

    @Query("""
        select i.image as image, i.type as type from Image i where i.name = :name
    """)
    Optional<IImage> findDataByName(String name); //Get image data by {name}

    Optional<Image> findByName(String name); //Get image by {name}

    boolean existsByName(String name); //Check exist image with {name}
}
