package com.ring.bookstore.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ring.bookstore.dtos.dashboard.IStat;
import com.ring.bookstore.enums.BookType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.dtos.books.IBookDisplay;
import com.ring.bookstore.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query(value = """
        select b.id as id, b.slug as slug, b.title as title, i.name as image,
            (case when :withDesc = true then b.description else null end) as description,
            b.price as price, b.discount as discount, b.amount as amount, s.id as shopId,
            s.name as shopName,
            coalesce(rv.rating, 0) as rating,
            coalesce(od.totalOrders, 0) as totalOrders
        from Book b join b.shop s join b.image i
        left join (select r.book.id as book_id, avg(r.rating) as rating
            from Review r
            group by r.book.id) rv on b.id = rv.book_id
        left join (select o.book.id as book_id, sum(o.quantity) as totalOrders
            from OrderItem o
            group by o.book.id) od on b.id = od.book_id
        where concat (b.title, b.author, s.name) ilike %:keyword%
        and (coalesce(:shopId) is null or b.shop.id = :shopId)
        and (coalesce(:cateId) is null or b.cate.id = :cateId or b.cate.parent.id = :cateId)
        and (coalesce(:pubIds) is null or b.publisher.id in :pubIds)
        and (coalesce(:types) is null or b.type in :types)
        and coalesce(rv.rating, 0) >= :rating
        and b.price * (1 - b.discount) between :fromRange and :toRange
        and b.amount >= :amount
        group by b, i.name, rv.rating, od.totalOrders, s.id, s.name
    """,
    countQuery = """
     select count(b)
        from Book b join b.shop s
        left join (select r.book.id as book_id, avg(r.rating) as rating
            from Review r
            group by r.book.id) rv on b.id = rv.book_id
        where concat (b.title, b.author, s.name) ilike %:keyword%
        and (coalesce(:shopId) is null or b.shop.id = :shopId)
        and (coalesce(:cateId) is null or b.cate.id = :cateId or b.cate.parent.id = :cateId)
        and (coalesce(:pubIds) is null or b.publisher.id in :pubIds)
        and (coalesce(:types) is null or b.type in :types)
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
                                           Double fromRange,
                                           Double toRange,
                                           Boolean withDesc,
                                           Integer rating,
                                           Integer amount,
                                           Pageable pageable);

    @Query("""
        select b.id as id, b.slug as slug, b.title as title, i.name as image,
            (case when :withDesc = true then b.description else null end) as description,
            b.price as price, b.discount as discount, b.amount as amount, s.id as shopId,
            s.name as shopName,
            coalesce(rv.rating, 0) as rating,
            coalesce(od.totalOrders, 0) as totalOrders
        from Book b join b.shop s join b.image i
        left join (select r.book.id as book_id, avg(r.rating) as rating
            from Review r
            group by r.book.id) rv on b.id = rv.book_id
        left join (select o.book.id as book_id, sum(o.quantity) as totalOrders
            from OrderItem o
            group by o.book.id) od on b.id = od.book_id
        group by b, i.name, rv.rating, od.totalOrders, s.id, s.name
        order by random()
        limit :amount
    """)
    List<IBookDisplay> findRandomBooks(Integer amount,
                                       Boolean withDesc); //Get random books

    @Query("""
        select b.id as id, b.slug as slug, b.title as title, i.name as image,
            b.price as price, b.discount as discount, b.amount as amount, s.id as shopId,
            s.name as shopName,
            coalesce(rv.rating, 0) as rating,
            coalesce(od.totalOrders, 0) as totalOrders
        from Book b join b.shop s join b.image i
        left join (select r.book.id as book_id, avg(r.rating) as rating
            from Review r
            group by r.book.id) rv on b.id = rv.book_id
        left join (select o.book.id as book_id, sum(o.quantity) as totalOrders
            from OrderItem o
            group by o.book.id) od on b.id = od.book_id
        where b.id in :ids
    """)
    List<IBookDisplay> findBooksDisplayInIds(List<Long> ids);

    @Query("""
        select b from Book b
        where b.id in :ids
    """)
    List<Book> findBooksInIds(List<Long> ids);

    @Query("""
        select count(b.id) as total,
        count(case when b.lastModifiedDate >= date_trunc('month', current date) then 1 end) as currentMonth,
        count(case when b.lastModifiedDate >= date_trunc('month', current date) - 1 month
            and b.lastModifiedDate < date_trunc('month', current date) then 1 end) lastMonth
        from Book b
        where (coalesce(:shopId) is null or b.shop.id = :shopId)
    """)
    IStat getBookAnalytics(Long shopId);

    @Query("""
        delete from Book b where b.shop.owner.id = :id
    """)
    void deleteBySellerId(Long id);

    @Modifying
    @Query("""
        update Book b set b.amount = b.amount - :amount where b.id = :id
    """)
    void decreaseStock(Long id, short amount);
}
