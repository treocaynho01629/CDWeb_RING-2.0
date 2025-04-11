package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.orders.IOrderDetail;
import com.ring.bookstore.model.entity.OrderDetail;
import com.ring.bookstore.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link OrderDetailRepository} for managing {@link OrderDetail} entities.
 */
@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    /**
     * Retrieves an OrderDetail entity by its ID.
     * It fetches related Order entity data using a join fetch.
     *
     * @param id the ID of the OrderDetail to retrieve
     * @return an Optional containing the OrderDetail if found, or an empty Optional if not found
     */
    @Query("""
       select od from OrderDetail od
       join fetch od.order o
       where od.id = :id
    """)
    Optional<OrderDetail> findDetailById(Long id);

    /**
     * Finds all order detail IDs belonging to a specific user, filtered by the provided status and keyword.
     *
     * @param id the ID of the user whose order detail IDs are to be retrieved
     * @param status the status of the orders to filter by (nullable, filters all statuses if null)
     * @param keyword a search keyword used to filter by book title, shop name, or order ID (partial match)
     * @param pageable the pagination information for retrieving the results
     * @return a paginated list of order detail IDs matching the provided criteria
     */
    @Query("""
        select od.id
        from OrderDetail od
        join OrderItem oi on od.id = oi.detail.id
        left join Shop s on od.shop.id = s.id
        left join Book b on oi.book.id = b.id
        where od.order.user.id = :id
        and (coalesce(:status) is null or od.status = :status)
        and concat (b.title, s.name, od.order.id) ilike %:keyword%
        group by od.id
        order by od.id desc
    """)
    Page<Long> findAllIdsByUserId(Long id, OrderStatus status, String keyword, Pageable pageable);

    /**
     * Retrieves a paginated list of order IDs associated with a given book ID.
     * The IDs are grouped and sorted in descending order.
     *
     * @param id       the ID of the book to filter orders by
     * @param pageable the pagination and sorting information
     * @return a page containing the IDs of the orders
     */
    @Query("""
        select od.id
        from OrderDetail od
        join od.items oi
        left join oi.book b
        where b.id = :id
        group by od.id
        order by od.id desc
    """)
    Page<Long> findAllIdsByBookId(Long id, Pageable pageable); //Get orders with book's {id}

    /**
     * Retrieves a list of distinct order details along with additional information
     * such as order ID, shop name, user data, address details, and aggregated
     * information of the provided receipt IDs.
     *
     * @param ids the list of receipt IDs to retrieve order details for
     * @return a list of {@code IOrderDetail} objects matching the provided receipt IDs,
     *         containing detailed information about the orders
     */
    @Query("""
        select od as detail,
        o.id as orderId, s.name as shopName, u.email as email, u.username as username,
        a.phone as phone, a.name as name, i as image, a.address as address, o.orderMessage as message,
        o.lastModifiedDate as date, o.total as total, o.totalDiscount as totalDiscount,
        sum(oi.quantity) as totalItems
        from OrderDetail od
        join od.order o
        join od.items oi
        join o.address a
        left join od.shop s
        left join o.user u
        left join u.profile p
        left join p.image i
        where o.id in :ids
        group by o.id, i.id, a.name, s.name, u.email, u.username, od.id, a.phone, a.address
    """)
    List<IOrderDetail> findAllByReceiptIds(List<Long> ids);
}
