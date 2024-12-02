package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.publishers.IPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Publisher;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Integer>{
    @Query("""
          select p as publisher, i.name as image
          from Publisher p left join p.image i
    """)
    Page<IPublisher> findPublishers(Pageable pageable);

    @Query("""
          select p as publisher, i.name as image
          from Publisher p left join p.image i
          where p.id = :id
    """)
    Optional<IPublisher> findProjectionById(Integer id);

    @Query("""
	    select p.id from Publisher p where p.id not in :ids
	""")
    List<Integer> findInverseIds(List<Integer> ids);
}
