package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.orders.IOrderDetailItem;
import com.ring.bookstore.model.dto.projection.orders.IOrderItem;
import com.ring.bookstore.model.entity.OrderDetail;
import com.ring.bookstore.model.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface named {@link OrderItemRepository} for managing {@link OrderItem} entities.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Retrieves a list of order items and their associated details based on the provided
     * detail IDs. The result includes information about the order item, book, order detail,
     * and shop, if available.
     *
     * @param ids the list of detail IDs to filter the query
     * @return a list of {@link IOrderItem} projections containing order item and related details
     */
    @Query("""
        select oi as item,
        b.id as bookId, b.title as title, b.slug as slug, i as image,
        od.id as detailId, od.totalPrice as totalPrice, od.shippingFee as shippingFee,
        od.shippingDiscount as shippingDiscount, od.discount as discount, od.status as status,
        s.id as shopId, s.name as shopName
        from OrderItem oi
        join oi.detail od
        left join od.shop s
        left join oi.book b
        left join b.image i
        where od.id in :ids
        order by oi.detail.id desc
    """)
    List<IOrderItem> findAllWithDetailIds(List<Long> ids);

    /**
     * Retrieves a list of order detail items based on the provided detail ID and user ID.
     *
     * @param id the ID of the order detail to retrieve items for
     * @param userId the ID of the user associated with the order; if null, no user filter is applied
     * @return a list of IOrderDetailItem projections containing detailed order item information
     */
    @Query("""
        select o.id as orderId, a.name as name, a.companyName as companyName,
        a.city as city, a.address as address, o.orderMessage as message, a.phone as phone,
        o.createdDate as orderedDate, o.lastModifiedDate as date, oi as item, o.paymentType as paymentType,
        b.id as bookId, b.title as title, b.slug as slug, i as image, o.shippingType as shippingType,
        od.id as detailId, od.totalPrice as totalPrice, od.shippingFee as shippingFee,
        od.shippingDiscount as shippingDiscount, od.discount as discount, od.status as status,
        s.id as shopId, s.name as shopName
        from OrderItem oi
        join oi.detail od
        join od.order o
        join o.address a
        left join od.shop s
        left join oi.book b
        left join b.image i
        where od.id = :id
        and (coalesce(:userId) is null or o.user.id = :userId)
    """)
    List<IOrderDetailItem> findOrderDetailItems(Long id, Long userId);
}
