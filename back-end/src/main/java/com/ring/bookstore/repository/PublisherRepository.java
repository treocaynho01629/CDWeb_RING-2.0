package com.ring.bookstore.repository;

import com.ring.bookstore.model.entity.Publisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link PublisherRepository} for managing {@link JpaRepository} entities.
 */
@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Integer> {

    /**
     * Retrieves a paginated list of publishers, including their associated images if available.
     *
     * @param pageable the pagination information, including page number and size
     * @return a paginated list of publishers with their associated images
     */
    @Query("""
          select p as publisher
          from Publisher p left join fetch p.image i
    """)
    Page<Publisher> findPublishers(Pageable pageable);

    /**
     * Finds and retrieves a pageable list of distinct publishers associated with a given category or its parent category.
     * The query fetches publishers and their associated images while grouping results by publisher and image identifiers.
     *
     * @param cateId the identifier of the category or its parent category used to filter relevant publishers
     * @param pageable pagination information for the results
     * @return a pageable object containing the list of relevant publishers
     */
    @Query("""
          select distinct p as publisher
          from Publisher p left join fetch p.image i
          join p.publisherBooks b
          join b.cate c
          where c.id = :cateId or c.parent.id = :cateId
          group by p.id, i.id
    """)
    Page<Publisher> findRelevantPublishers(Integer cateId, Pageable pageable);

    /**
     * Retrieves a {@link Publisher} entity along with its associated image by the specified ID.
     *
     * @param id the unique identifier of the publisher to retrieve
     * @return an {@link Optional} containing the publisher with its image if found, or an empty {@link Optional} if no publisher exists with the given ID
     */
    @Query("""
          select p as publisher
          from Publisher p left join fetch p.image i
          where p.id = :id
    """)
    Optional<Publisher> findWithImageById(Integer id);

    /**
     * Retrieves a list of publisher IDs that are not present in the provided list of IDs.
     *
     * @param ids a list of IDs to exclude from the query result
     * @return a list of publisher IDs that are not in the provided list
     */
    @Query("""
	    select p.id from Publisher p where p.id not in :ids
	""")
    List<Integer> findInverseIds(List<Integer> ids);
}
