package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.orders.IOrderDetail;
import com.ring.bookstore.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.OrderDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    @Query("""
       select od from OrderDetail od
       join fetch od.order o
       where od.id = :id
    """)
    Optional<OrderDetail> findDetailById(Long id);

    @Query("""
        select od.id
        from OrderDetail od
        join OrderItem oi on od.id = oi.detail.id
        join Shop s on od.shop.id = s.id
        join Book b on oi.book.id = b.id
        where od.order.user.id = :id
        and (coalesce(:status) is null or od.status = :status)
        and concat (b.title, s.name, od.order.id) ilike %:keyword%
        group by od.id
        order by od.id desc
    """)
    Page<Long> findAllIdsByUserId(Long id, OrderStatus status, String keyword, Pageable pageable);

    @Query("""
        select od.id
        from OrderDetail od
        join od.items oi
        where oi.book.id = :id
        group by od.id
        order by od.id desc
    """)
    Page<Long> findAllIdsByBookId(Long id, Pageable pageable); //Get orders with book's {id}

    @Query("""
        select distinct od as detail,
        o.id as orderId, s.name as shopName, u.email as email, u.username as username,
        a.phone as phone, a.name as name, i.name as image, a.address as address, o.orderMessage as message,
        o.createdDate as date, o.total as total, o.totalDiscount as totalDiscount,
        sum(oi.quantity) as totalItems
        from OrderDetail od
        join od.order o
        join od.items oi
        join od.shop s
        join o.address a
        join o.user u
        left join u.profile p
        left join p.image i
        where o.id in (:ids)
        group by o.id, i.name, a.name, s.name, u.email, u.username, od.id, a.phone, a.address
    """)
    List<IOrderDetail> findAllWithReceiptIds(List<Long> ids);
}
