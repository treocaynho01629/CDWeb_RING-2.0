package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.orders.IOrderItem;
import com.ring.bookstore.model.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface named {@link OrderItemRepository} for managing
 * {@link OrderItem} entities.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Retrieves a list of order items and their associated details based on the
     * provided
     * detail IDs. The result includes information about the order item, book, order
     * detail,
     * and shop, if available.
     *
     * @param ids the list of detail IDs to filter the query
     * @return a list of {@link IOrderItem} projections containing order item and
     *         related details
     */
    @Query("""
                select oi.id as id, oi.quantity as quantity, oi.price as price, oi.discount as discount,
                b.id as bookId, b.title as title, b.slug as slug, i as image, od.id as detailId
                from OrderItem oi
                join oi.detail od
                left join od.shop s
                left join oi.book b
                left join b.image i
                where od.id in :ids
                group by oi.id, b.id, od.id, i.id
                order by oi.detail.id desc
            """)
    List<IOrderItem> findAllWithDetailIds(List<Long> ids);
}
