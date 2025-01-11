package com.ring.bookstore.repository;

import java.util.List;
import java.util.Optional;

import com.ring.bookstore.dtos.images.IImage;
import com.ring.bookstore.dtos.images.IImageInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query("""
        select i.id as id, i.name as name, i.type as type
        from Image i
        where i.parent is null
    """)
    List<IImageInfo> findAllInfo();

    @Query("""
        select i.id as id, i.name as name, i.type as type
        from Image i
        where i.id in :ids
    """)
    List<IImageInfo> findInfo(List<Long> ids);

    @Query("""
        select i.id as id, i.name as name, i.type as type
        from AccountProfile p
        join p.image i
        where p.id = :id
    """)
    Optional<IImageInfo> findInfoByProfileId(Long id);

    @Query("""
        select i.image as image, i.type as type from Image i where i.name = :name
    """)
    Optional<IImage> findDataByName(String name);

    Optional<Image> findByName(String name);

    @Query("""
        select i
        from Image i
        left join i.detail d
        left join Book b on b.image.id = i.id
        where (b.id = :bookId or d.book.id = :bookId)
        and i.id = :imageId
    """)
    Optional<Image> findBookImage(Long bookId, Long imageId);

    @Query("""
        select i.id from Image i
        left join i.detail d
        left join Book b on b.image.id = i.id
        where (b.id = :bookId or d.book.id = :bookId)
        and i.id in :imageIds
    """)
    List<Long> findBookImages(Long bookId, List<Long> imageIds);

    boolean existsByName(String name);
}
