package com.ring.repository;

import com.ring.dto.projection.books.IBookDisplay;
import com.ring.dto.projection.dashboard.IStat;
import com.ring.model.entity.Account;
import com.ring.model.entity.Book;
import com.ring.model.enums.BookType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repository interface named {@link BookRepository} for managing {@link Book} entities.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * Finds books that match the specified filter criteria.
     *
     * @param keyword  the search keyword to match against book titles, authors, or shop names
     * @param cateId   the category ID to filter books by specific category or its parent category; can be null
     * @param pubIds   the list of publisher IDs to filter books by publishers; can be null
     * @param types    the list of book types to filter books by; can be null
     * @param shopId   the shop ID to filter books by a specific shop; can be null
     * @param userId   the user ID to filter books by shop owner; can be null
     * @param fromRange the minimum price range (after applying discounts) to filter books by
     * @param toRange   the maximum price range (after applying discounts) to filter books by
     * @param withDesc  a flag indicating whether to include book descriptions in the result
     * @param rating    the minimum average rating to filter books by
     * @param amount    the minimum available quantity to filter books by
     * @param pageable  the pagination information to define the page size and sorting
     * @return a page containing books matching the filter criteria encapsulated as IBookDisplay objects
     */
    @Query(value = """
                select b.id as id, b.slug as slug, b.title as title,
                    (case when :withDesc = true then b.description else null end) as description,
                    b.price as price, b.discount as discount, b.amount as amount, s.id as shopId,
                    s.name as shopName, i as image,
                    coalesce(rv.rating, 0) as rating,
                    coalesce(od.totalOrders, 0) as totalOrders
                from Book b
                join b.shop s
                left join b.image i
                left join (select r.book.id as book_id, avg(r.rating) as rating
                    from Review r
                    group by r.book.id) rv on b.id = rv.book_id
                left join (select o.book.id as book_id, sum(o.quantity) as totalOrders
                    from OrderItem o
                    group by o.book.id) od on b.id = od.book_id
                where concat (b.title, b.author, s.name) ilike %:keyword%
                and (coalesce(:cateId) is null or b.cate.id = :cateId or b.cate.parent.id = :cateId)
                and (coalesce(:pubIds) is null or b.publisher.id in :pubIds)
                and (coalesce(:types) is null or b.type in :types)
                and (coalesce(:shopId) is null or b.shop.id = :shopId)
                and (coalesce(:userId) is null or b.shop.owner.id = :userId)
                and coalesce(rv.rating, 0) >= :rating
                and b.price * (1 - b.discount) between :fromRange and :toRange
                and b.amount >= :amount
                group by b, i.id, rv.rating, od.totalOrders, s.id, s.name
            """,
            countQuery = """
                     select count(b)
                        from Book b
                        join b.shop s
                        left join (select r.book.id as book_id, avg(r.rating) as rating
                            from Review r
                            group by r.book.id) rv on b.id = rv.book_id
                        where concat (b.title, b.author, s.name) ilike %:keyword%
                        and (coalesce(:cateId) is null or b.cate.id = :cateId or b.cate.parent.id = :cateId)
                        and (coalesce(:pubIds) is null or b.publisher.id in :pubIds)
                        and (coalesce(:types) is null or b.type in :types)
                        and (coalesce(:shopId) is null or b.shop.id = :shopId)
                        and (coalesce(:userId) is null or b.shop.owner.id = :userId)
                        and coalesce(rv.rating, 0) >= :rating
                        and b.price * (1 - b.discount) between :fromRange and :toRange
                        and b.amount >= :amount
                        group by b, rv.rating, s.id, s.name
                    """)
    Page<IBookDisplay> findBooksWithFilter(String keyword,
                                           Integer cateId,
                                           List<Integer> pubIds,
                                           List<BookType> types,
                                           Long shopId,
                                           Long userId,
                                           Double fromRange,
                                           Double toRange,
                                           Boolean withDesc,
                                           Integer rating,
                                           Integer amount,
                                           Pageable pageable);

    /**
     * Retrieves a list of random books based on the specified number of books to fetch.
     * Optionally includes descriptions depending on the provided parameter.
     *
     * @param amount   the number of random books to retrieve
     * @param withDesc a boolean indicating whether to include book descriptions in the result
     * @return a List of {@link IBookDisplay} containing the details of the randomly fetched books
     */
    @Query("""
                select b.id as id, b.slug as slug, b.title as title,
                    (case when :withDesc = true then b.description else null end) as description,
                    b.price as price, b.discount as discount, b.amount as amount, s.id as shopId,
                    s.name as shopName, i as image,
                    coalesce(rv.rating, 0) as rating,
                    coalesce(od.totalOrders, 0) as totalOrders
                from Book b join b.shop s left join b.image i
                left join (select r.book.id as book_id, avg(r.rating) as rating
                    from Review r
                    group by r.book.id) rv on b.id = rv.book_id
                left join (select o.book.id as book_id, sum(o.quantity) as totalOrders
                    from OrderItem o
                    group by o.book.id) od on b.id = od.book_id
                group by b, i.id, rv.rating, od.totalOrders, s.id, s.name
                order by random()
                limit :amount
            """)
    List<IBookDisplay> findRandomBooks(Integer amount,
                                       Boolean withDesc); //Get random books

    /**
     * Retrieves a list of books matching the given IDs with detailed information such as id, slug, title, price,
     * discount, amount, associated shop details (id, name), image, rating, and total orders.
     *
     * This method performs a query that joins multiple entities, such as Shop, Image, Review, and OrderItem,
     * to gather the required information for display purposes.
     *
     * @param ids a list of book IDs for which the display information is to be retrieved
     * @return a list of {@link IBookDisplay} containing the display information of the books matching the given IDs
     */
    @Query("""
                select b.id as id, b.slug as slug, b.title as title,
                    b.price as price, b.discount as discount, b.amount as amount, s.id as shopId,
                    s.name as shopName, i as image,
                    coalesce(rv.rating, 0) as rating,
                    coalesce(od.totalOrders, 0) as totalOrders
                from Book b join b.shop s left join b.image i
                left join (select r.book.id as book_id, avg(r.rating) as rating
                    from Review r
                    group by r.book.id) rv on b.id = rv.book_id
                left join (select o.book.id as book_id, sum(o.quantity) as totalOrders
                    from OrderItem o
                    group by o.book.id) od on b.id = od.book_id
                where b.id in :ids
            """)
    List<IBookDisplay> findBooksDisplayInIds(List<Long> ids);

    /**
     * Retrieves a list of books given their IDs.
     *
     * @param ids a list of book IDs to look up
     * @return a list of Book entities matching the provided IDs
     */
    @Query("""
                select b from Book b
                where b.id in :ids
            """)
    List<Book> findBooksInIds(List<Long> ids);

    /**
     * Finds and retrieves a list of book IDs from the database that match the given list of IDs
     * and belong to the specified owner.
     *
     * @param ids the list of book IDs to be searched
     * @param ownerId the ID of the owner to whom the books must belong
     * @return a list of book IDs that match the given criteria
     */
    @Query("""
                select b.id from Book b
                where b.id in :ids
                and b.shop.owner.id = :ownerId
            """)
    List<Long> findBookIdsByInIdsAndOwner(List<Long> ids, Long ownerId);

    /**
     * Retrieves a list of book IDs that match specified search criteria and filters, excluding specific IDs.
     *
     * @param keyword The search keyword to match against the concatenation of book title, author, and shop name.
     * @param cateId The ID of the category to filter books by. Supports category or its parent ID.
     * @param pubIds A list of publisher IDs to filter books by. Can be null.
     * @param types A list of book types to filter by. Can be null.
     * @param shopId The ID of the shop to filter books by. Can be null.
     * @param userId The ID of the shop owner to filter books by. Can be null.
     * @param fromRange The minimum price range (considering discounts) for filtering.
     * @param toRange The maximum price range (considering discounts) for filtering.
     * @param rating The minimum average rating to filter books by. Defaults to zero if not provided.
     * @param amount The minimum stock amount to filter books by.
     * @param ids A list of book IDs to exclude from the results.
     * @return A list of book IDs that satisfy the provided criteria.
     */
    @Query("""
                select b.id
                from Book b
                join b.shop s
                left join (select r.book.id as book_id, avg(r.rating) as rating
                    from Review r
                    group by r.book.id) rv on b.id = rv.book_id
                where concat (b.title, b.author, s.name) ilike %:keyword%
                and (coalesce(:cateId) is null or b.cate.id = :cateId or b.cate.parent.id = :cateId)
                and (coalesce(:pubIds) is null or b.publisher.id in :pubIds)
                and (coalesce(:types) is null or b.type in :types)
                and (coalesce(:shopId) is null or b.shop.id = :shopId)
                and (coalesce(:userId) is null or b.shop.owner.id = :userId)
                and coalesce(rv.rating, 0) >= :rating
                and b.price * (1 - b.discount) between :fromRange and :toRange
                and b.amount >= :amount
                and b.id not in :ids
                group by b, rv.rating, s.id, s.name
            """)
    List<Long> findInverseIds(String keyword,
                              Integer cateId,
                              List<Integer> pubIds,
                              List<BookType> types,
                              Long shopId,
                              Long userId,
                              Double fromRange,
                              Double toRange,
                              Integer rating,
                              Integer amount,
                              List<Long> ids);

    /**
     * Retrieves analytics related to books such as the total number of books,
     * books created in the current month, and books created in the last month.
     *
     * @param shopId the identifier of the shop for which analytics is to be retrieved;
     *               if null, analytics is calculated for all shops
     * @param userId the identifier of the shop owner which analytics is to be retrieved;
     *               if null, analytics is calculated for all owners
     * @return an object of type {@code IStat} containing the book analytics, including the total count,
     *         current month count, and last month count
     */
    @Query("""
                select count(b.id) as total,
                count(case when b.createdDate >= date_trunc('month', current date) then 1 end) as currentMonth,
                count(case when b.createdDate >= date_trunc('month', current date) - 1 month
                    and b.createdDate < date_trunc('month', current date) then 1 end) lastMonth
                from Book b
                where (coalesce(:shopId) is null or b.shop.id = :shopId)
                and (coalesce(:userId) is null or b.shop.owner.id = :userId)
            """)
    IStat getBookAnalytics(Long shopId, Long userId);

    /**
     * Retrieves a list of suggested keywords that match the given keyword, based on the database query.
     * The method derives possible suggestions from the `title` field of the `Book` entity.
     *
     * @param keyword the search keyword used for finding suggestions. It is matched against book titles.
     * @return a list of up to 9 suggested keywords, sorted by relevance to the given keyword.
     */
    @Query(value= """
            select t.keyword
            from (
            	select distinct substring(left(lower(regexp_replace(b.title, CONCAT('^.*?(\\S*', :keyword, '\\S*)'), '\\1', 'i')) || ' ', 24) from '.*\\s') as keyword
            	from book b
            	where b.title ilike concat('%', :keyword, '%')
            ) t
            order by case when t.keyword ilike concat('%', :keyword, '%') then 1 else 2 end, t.keyword
            limit 9
            """, nativeQuery = true)
    List<String> findSuggestion(String keyword);

    /**
     * Decreases the stock quantity of a specified book by the given amount.
     *
     * @param id the unique identifier of the book whose stock is to be decreased
     * @param amount the number of units to decrease from the book's stock
     */
    @Modifying
    @Transactional
    @Query("""
                update Book b set b.amount = b.amount - :amount where b.id = :id
            """)
    void decreaseStock(Long id, short amount);

    /**
     * Deletes all records associated with the given shop ID.
     *
     * @param shopId the ID of the shop whose associated records should be deleted
     */
    void deleteAllByShopId(Long shopId);

    /**
     * Deletes all entities associated with the given shop owner.
     *
     * @param owner the account representing the shop owner whose associated entities are to be deleted
     */
    void deleteAllByShop_Owner(Account owner);

    /**
     * Deletes all entities associated with the given shop ID and shop owner.
     *
     * @param shopId the unique identifier of the shop whose associated entities are to be deleted
     * @param owner the account representing the owner of the shop
     */
    void deleteAllByShopIdAndShop_Owner(Long shopId, Account owner);
}
