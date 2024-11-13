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
                   select od from OrderDetail od join fetch OrderReceipt o on od.order.id = o.id 
                   where od.id = :id
            """)
    Optional<OrderDetail> findDetailById(Long id);

    @Query("""
            select distinct od from OrderDetail od
            join OrderReceipt o on o.id = od.order.id 
            join fetch OrderItem oi on od.id = oi.detail.id
            where o.user.id = :id
            and (coalesce(:status) is null or od.status = :status)
            and concat (oi.book.title, od.shop.name, o.id) ilike %:keyword%
            """)
    Page<OrderDetail> findAllByUserId(Long id, OrderStatus status, String keyword, Pageable pageable); //Get orders from user's {id}

    @Query("""
            select distinct od from OrderDetail od
            join OrderItem oi on od.id = oi.detail.id
            where oi.book.id = :id
            """)
    Page<OrderDetail> findAllByBookId(Long id, Pageable pageable); //Get orders with book's {id}

}
