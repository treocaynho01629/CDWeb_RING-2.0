package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.books.IBook;
import com.ring.bookstore.dtos.books.IBookDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.BookDetail;

import java.util.Optional;

@Repository
public interface BookDetailRepository extends JpaRepository<BookDetail, Long>{
    @Query("""
            select distinct b.id as id, b.slug as slug, b.price as price, b.discount as discount, b.title as title,
                b.description as description, b.type as type, b.author as author, b.amount as amount, i.name as image,
                p.id as pubId, p.name as pubName, c.id as cateId, c.name as cateName, c.slug as cateSlug,
                pc.id as parentId, pc.name as parentName, pc.slug as parentSlug, pc.ancestor_id as ancestorId,
                s.id as shopId, s.name as shopName,
                d.size as size, d.pages as pages, d.bDate as date, d.bLanguage as language, d.bWeight as weight,
                pv.previews as previews,
                coalesce(od.totalOrders, 0) as totalOrders,
            	coalesce(rv.rating, 0) as rating, rv.totalRates as totalRates,
            	coalesce(rv.five, 0) as rate5,
            	coalesce(rv.four, 0) as rate4,
            	coalesce(rv.three, 0) as rate3,
            	coalesce(rv.two, 0) as rate2,
            	coalesce(rv.one, 0) as rate1
            from Book b
            left join b.detail d
            left join (
                select pi.detail.id as detail_id, array_agg(pi.name)
                over (order by pi.detail.id) as previews
                from Image pi) pv on pv.detail_id = d.id
            left join b.image i
            join b.shop s
            join b.publisher p
            join b.cate c
            left join (select p.id as id, p.name as name, p.slug as slug, p.parent.id as ancestor_id
                from Category p) pc on pc.id = c.parent.id
            left join (select o.book.id as book_id, sum(o.quantity) as totalOrders
            	from OrderItem o group by o.book.id) od on b.id = od.book_id
            left join (
            	select r.book.id as book_id,
            	    avg(r.rating) as rating,
            	    count(r.id) as totalRates,
            		sum(case when r.rating = 5 then 1 else 0 end) as five,
            		sum(case when r.rating = 4 then 1 else 0 end) as four,
            		sum(case when r.rating = 3 then 1 else 0 end) as three,
            		sum(case when r.rating = 2 then 1 else 0 end) as two,
            		sum(case when r.rating = 1 then 1 else 0 end) as one
            	from Review r group by r.book.id
            ) rv on b.id = rv.book_id
            where case when coalesce(:id) is not null
                then (b.id = :id) else (b.slug = :slug) end
            """)
    Optional<IBookDetail> findBookDetail(Long id, String slug);

    @Query("""
            select distinct b.id as id, b.slug as slug, b.price as price, b.discount as discount, b.title as title,
                b.description as description, b.type as type, b.author as author, b.amount as amount, i.id as image,
                p.id as pubId, p.name as pubName, c.id as cateId, c.name as cateName, s.id as shopId, s.name as shopName,
                d.size as size, d.pages as pages, d.bDate as date, d.bLanguage as language, d.bWeight as weight,
                pv.previews as previews
            from Book b
            left join b.detail d
            left join (
                select pi.detail.id as detail_id, array_agg(pi.id)
                over (order by pi.detail.id) as previews
                from Image pi) pv on pv.detail_id = d.id
            left join b.image i
            join b.shop s
            join b.publisher p
            join b.cate c
            where b.id = :id
            """)
    Optional<IBook> findBook(Long id);
}
