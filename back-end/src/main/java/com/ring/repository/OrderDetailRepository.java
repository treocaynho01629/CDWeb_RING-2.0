package com.ring.repository;

import com.ring.dto.projection.dashboard.IStat;
import com.ring.dto.projection.orders.IOrder;
import com.ring.dto.projection.orders.IOrderDetail;
import com.ring.model.entity.OrderDetail;
import com.ring.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link OrderDetailRepository} for managing
 * {@link OrderDetail} entities.
 */
@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    /**
     * Retrieves an OrderDetail entity by its ID.
     * It fetches related Order entity data using a join fetch.
     *
     * @param id the ID of the OrderDetail to retrieve
     * @return an Optional containing the OrderDetail if found, or an empty Optional
     *         if not found
     */
    @Query("""
               select od from OrderDetail od
               join fetch od.order o
               where od.id = :id
            """)
    Optional<OrderDetail> findDetailById(Long id);

    @Query("""
                select o.id as orderId, od.id as id, s.id as shopId, s.name as shopName, od.note as note,
                od.lastModifiedDate as date, od.totalPrice as totalPrice, od.discount as discount,
                od.shippingFee as shippingFee, od.shippingDiscount as shippingDiscount, sum(oi.quantity) as totalItems,
                od.status as status
                from OrderDetail od
                join od.order o
                join OrderItem oi on od.id = oi.detail.id
                left join Shop s on od.shop.id = s.id
                left join Book b on oi.book.id = b.id
                where od.order.user.id = :id
                and (coalesce(:status) is null or od.status = :status)
                and concat (b.title, s.name, od.order.id) ilike %:keyword%
                group by o.id, s.id, od.id
                order by od.id desc
            """)
    Page<IOrder> findAllByUserId(Long id,
            OrderStatus status,
            String keyword,
            Pageable pageable);

    @Query("""
                select o.id as orderId, od.id as id, s.id as shopId, s.name as shopName, od.note as note,
                od.lastModifiedDate as date, od.totalPrice as totalPrice, od.discount as discount,
                od.shippingFee as shippingFee, od.shippingDiscount as shippingDiscount, sum(oi.quantity) as totalItems,
                od.status as status
                from OrderDetail od
                join od.order o
                join OrderItem oi on od.id = oi.detail.id
                left join Shop s on od.shop.id = s.id
                left join Book b on oi.book.id = b.id
                where b.id = :id
                group by o.id, s.id, od.id
                order by od.id desc
            """)
    Page<IOrder> findAllByBookId(Long id,
            Pageable pageable); // Get orders with book's {id}

    /**
     * Retrieves a list of distinct order details along with additional information
     * such as order ID, shop name, user data, address details, and aggregated
     * information of the provided receipt IDs.
     *
     * @param ids the list of receipt IDs to retrieve order details for
     * @return a list of {@code IOrder} objects matching the provided receipt
     *         IDs,
     *         containing detailed information about the orders
     */
    @Query("""
                select o.id as orderId, od.id as id, s.id as shopId, s.name as shopName, od.note as note,
                od.lastModifiedDate as date, od.totalPrice as totalPrice, od.discount as discount,
                od.shippingFee as shippingFee, od.shippingDiscount as shippingDiscount, sum(oi.quantity) as totalItems,
                od.status as status
                from OrderDetail od
                join od.order o
                join OrderItem oi on od.id = oi.detail.id
                left join Shop s on od.shop.id = s.id
                where o.id in :ids
                group by o.id, s.id, od.id
            """)
    List<IOrder> findAllByReceiptIds(List<Long> ids);

    @Query("""
                select o.id as orderId, od.id as id, s.id as shopId, s.name as shopName, od.note as note,
                od.lastModifiedDate as date, od.totalPrice as totalPrice, od.discount as discount,
                od.shippingFee as shippingFee, od.shippingDiscount as shippingDiscount, sum(oi.quantity) as totalItems,
                od.status as status
                from OrderDetail od
                join od.order o
                join OrderItem oi on od.id = oi.detail.id
                left join Shop s on od.shop.id = s.id
                where o.id = :id
                group by o.id, s.id, od.id
            """)
    List<IOrder> findAllByReceiptId(Long id);

    @Query("""
                select od.id as id, o.id as orderId, a.name as name, a.companyName as companyName,
                a.city as city, a.address as address, od.note as note, a.phone as phone,
                od.createdDate as orderedDate, od.lastModifiedDate as date, p.paymentType as paymentType,
                od.totalPrice as totalPrice, od.shippingFee as shippingFee, od.shippingType as shippingType,
                od.shippingDiscount as shippingDiscount, od.discount as discount, od.status as status,
                s.id as shopId, s.name as shopName, p.status as paymentStatus
                from OrderDetail od
                join od.items oi
                join od.order o
                left join o.payment p
                left join o.address a
                left join od.shop s
                left join oi.book b
                left join b.image i
                where od.id = :id
                and (coalesce(:userId) is null or o.user.id = :userId)
                group by o.id, s.id, od.id, a.id, p.id
            """)
    Optional<IOrderDetail> findOrderDetail(Long id, Long userId);

    /**
     * Retrieves sales analytics for a shop or user, including total sales for the
     * current and last month.
     * The query calculates the total revenue after applying discounts and excludes
     * shipping fees.
     *
     * @param shopId the ID of the shop to filter the analytics. If null, analytics
     *               for all shops are included.
     * @param userId the ID of the user (shop owner) to filter the analytics. If
     *               null, analytics for all users are included.
     * @return statistics containing total sales for the current month and the
     *         previous month.
     */
    @Query("""
                select coalesce(sum(case when od.lastModifiedDate >= date_trunc('month', current date)
                        then (od.totalPrice - od.discount) end), 0) as currentMonth,
                coalesce(sum(case when od.lastModifiedDate >= date_trunc('month', current date) - 1 month
                    and od.lastModifiedDate < date_trunc('month', current date)
                        then (od.totalPrice - od.discount) end), 0) lastMonth
                from OrderDetail od
                    left join od.shop s
                where od.status = com.ring.model.enums.OrderStatus.COMPLETED
                and od.lastModifiedDate >= date_trunc('month', current date) - 1 month
                and (coalesce(:shopId) is null or s.id = :shopId)
                and (coalesce(:userId) is null or s.owner.id = :userId)
            """)
    IStat getSalesAnalytics(Long shopId,
            Long userId);

    @Modifying
    @Query("""
                update OrderDetail od
                set od.status = com.ring.model.enums.OrderStatus.CANCELED,
                    od.note = :reason
                where od.order.id = :id
                and od.status = com.ring.model.enums.OrderStatus.PENDING_PAYMENT
            """)
    void cancelUnpaidByOrderId(Long id, String reason);

    @Modifying
    @Query("""
                update OrderDetail od
                set od.status = com.ring.model.enums.OrderStatus.PENDING
                where od.order.id = :id
                and od.status = com.ring.model.enums.OrderStatus.PENDING_PAYMENT
            """)
    void confirmPaymentByOrderId(Long id);
}
