package com.ring.bookstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Publisher;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Integer> {

    @Query("""
          select p as publisher
          from Publisher p left join fetch p.image i
    """)
    Page<Publisher> findPublishers(Pageable pageable);

    @Query("""
          select distinct p as publisher
          from Publisher p left join fetch p.image i
          join p.publisherBooks b
          join b.cate c
          where c.id = :cateId or c.parent.id = :cateId
          group by p.id, i.id
    """)
    Page<Publisher> findRelevantPublishers(Integer cateId, Pageable pageable);

    @Query("""
          select p as publisher
          from Publisher p left join fetch p.image i
          where p.id = :id
    """)
    Optional<Publisher> findWithImageById(Integer id);

    @Query("""
	    select p.id from Publisher p where p.id not in :ids
	""")
    List<Integer> findInverseIds(List<Integer> ids);
}
