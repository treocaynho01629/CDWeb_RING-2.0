package com.ring.bookstore.repository;

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
        join b.image i
        where od.id in (:ids)
    """)
    List<IOrderItem> findAllWithDetailIds(List<Long> ids);
}
