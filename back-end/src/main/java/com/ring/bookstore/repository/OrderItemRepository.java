package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.orders.IOrderDetailItem;
import com.ring.bookstore.dtos.orders.IOrderItem;
import com.ring.bookstore.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("""
        select oi as item,
        b.id as bookId, b.title as title, b.slug as slug, i.name as image,
        od.id as detailId, od.totalPrice as totalPrice, od.shippingFee as shippingFee,
        od.shippingDiscount as shippingDiscount, od.discount as discount, od.status as status,
        s.id as shopId, s.name as shopName
        from OrderItem oi
        join oi.detail od
        join od.shop s
        join oi.book b
        left join b.image i
        where od.id in (:ids)
        order by oi.detail.id desc
    """)
    List<IOrderItem> findAllWithDetailIds(List<Long> ids);

    @Query("""
        select o.id as orderId, a.name as name, a.companyName as companyName,
        a.city as city, a.address as address, o.orderMessage as message, a.phone as phone,
        o.createdDate as orderedDate, o.lastModifiedDate as date, oi as item, o.paymentType as paymentType,
        b.id as bookId, b.title as title, b.slug as slug, i.name as image, o.shippingType as shippingType,
        od.id as detailId, od.totalPrice as totalPrice, od.shippingFee as shippingFee,
        od.shippingDiscount as shippingDiscount, od.discount as discount, od.status as status,
        s.id as shopId, s.name as shopName
        from OrderItem oi
        join oi.detail od
        join od.order o
        join o.address a
        join od.shop s
        join oi.book b
        left join b.image i
        where od.id = :id
        and (coalesce(:userId) is null or o.user.id = :userId)
    """)
    List<IOrderDetailItem> findOrderDetailItems(Long id, Long userId);
}
