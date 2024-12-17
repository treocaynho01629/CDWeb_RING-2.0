package com.ring.bookstore.repository;

import com.ring.bookstore.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.OrderDetail;

import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    @Query("""
       select od from OrderDetail od join fetch od.order o
       where od.id = :id
    """)
    Optional<OrderDetail> findDetailById(Long id);

    @Query("""
        select distinct od.id
        from OrderDetail od
        join OrderItem oi on od.id = oi.detail.id
        join Shop s on od.shop.id = s.id
        join Book b on oi.book.id = b.id
        where od.order.user.id = :id
        and (coalesce(:status) is null or od.status = :status)
        and concat (b.title, s.name, od.order.id) ilike %:keyword%
        order by od.id desc
    """)
    Page<Long> findAllIdsByUserId(Long id, OrderStatus status, String keyword, Pageable pageable);

    @Query("""
        select distinct od.id from OrderDetail od
        join od.items oi
        where oi.book.id = :id
        order by od.id desc
    """)
    Page<Long> findAllIdsByBookId(Long id, Pageable pageable); //Get orders with book's {id}
}
