package com.ring.bookstore.repository;

import com.ring.bookstore.model.dto.projection.orders.IOrderReceipt;
import com.ring.bookstore.model.dto.projection.orders.IReceiptDetail;
import com.ring.bookstore.model.dto.projection.orders.IReceiptSummary;
import com.ring.bookstore.model.entity.OrderReceipt;
import com.ring.bookstore.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Repository interface named {@link OrderReceiptRepository} for managing {@link OrderReceipt} entities.
 */
@Repository
public interface OrderReceiptRepository extends JpaRepository<OrderReceipt, Long> {

    /**
     * Checks if a user has purchased a book.
     *
     * @param id the ID of the book to check.
     * @param userId the ID of the user to check for the purchase.
     * @return true if the user has purchased the book, false otherwise.
     */
    @Query("""
        select case when count(o) > 0 then true else false end
        from OrderReceipt o
        join o.details od
        join od.items oi
        where o.user.id = :userId and oi.book.id = :id
        and od.status = com.ring.bookstore.model.enums.OrderStatus.COMPLETED
    """)
    boolean hasUserBoughtBook(Long id,
                              Long userId); //Check if user have bought this book before

    @Query("""
                            select o.id as id, a.name as name, a.companyName as companyName,
                            a.city as city, a.address as address, a.phone as phone, o.createdDate as orderedDate,
                            o.lastModifiedDate as date, p.paymentType as paymentType, p.status as paymentStatus,
                            o.total as total, o.totalDiscount as totalDiscount, p.expiredAt as expiredAt
                            from OrderReceipt o
                            join o.payment p
                            join o.address a
                            where o.id = :id
                            and (coalesce(:userId) is null or o.user.id = :userId)
                            group by o.id, a.id, p.id
                        """)
    Optional<IReceiptDetail> findReceiptDetail(Long id, Long userId);

    /**
     * Retrieves a paginated list of receipt summaries based on the provided filtering criteria.
     * The method allows filtering by shop ID, user ID, and book ID. If no filters are provided,
     * all summaries are retrieved.
     *
     * @param shopId the ID of the shop to filter receipts by; if null, the filter is not applied
     * @param userId the ID of the shop owner to filter receipts by; if null, the filter is not applied
     * @param bookId the ID of the book to filter receipts by; if null, the filter is not applied
     * @param pageable the pagination and sorting information
     * @return a paginated list of {@code IReceiptSummary}, containing the receipt summaries matching the criteria
     */
    @Query(value = """
        select distinct o.id as id, i as image, a.name as name,
        o.lastModifiedDate as date, o.total - o.totalDiscount as totalPrice,
        sum(oi.quantity) as totalItems
        from OrderReceipt o
        join o.details od
        join o.address a
        join od.items oi
        left join o.user u
        left join u.profile p
        left join p.image i
        left join od.shop s
        left join oi.book b
        where (coalesce(:shopId) is null or s.id = :shopId)
        and (coalesce(:userId) is null or s.owner.id = :userId)
        and (coalesce(:bookId) is null or b.id = :bookId)
        group by o.id, i.id, a.name, o.lastModifiedDate
    """,
    countQuery = """
        select count(o.id)
        from OrderReceipt o
        join o.details od
        join od.items oi
        left join od.shop s
        left join oi.book b
        where (coalesce(:shopId) is null or s.id = :shopId)
        and (coalesce(:userId) is null or s.owner.id = :userId)
        and (coalesce(:bookId) is null or b.id = :bookId)
    """)
    Page<IReceiptSummary> findAllSummaries(Long shopId,
                                           Long userId,
                                           Long bookId,
                                           Pageable pageable);

    @Query("""
        select o.id as id, o.email as email, a.phone as phone, a.name as name,
            u.username as username, i as image, a.address as address, o.lastModifiedDate as date,
            o.total as total, o.totalDiscount as totalDiscount
        from OrderReceipt o
        join o.details od
        join od.items oi
        join o.address a
        left join o.user u
        left join u.profile p
        left join p.image i
        left join od.shop s
        left join Book b on oi.book.id = b.id
        where (coalesce(:shopId) is null or s.id = :shopId)
        and (coalesce(:userId) is null or s.owner.id = :userId)
        and (coalesce(:status) is null or od.status = :status)
        and concat (b.title, o.id) ilike %:keyword%
        group by o.id, a.id, u.id, i.id
    """)
    Page<IOrderReceipt> findAllBy(Long shopId,
                                Long userId,
                                OrderStatus status,
                                String keyword,
                                Pageable pageable);

    /**
     * Retrieves monthly sales data, including sales totals and discounts, grouped by month.
     *
     * @param shopId the ID of the shop to filter sales by; if null, no shop filtering will be applied
     * @param userId the ID of the user (shop owner) to filter sales by; if null, no user filtering will be applied
     * @param year the year to filter sales by; if null, no year filtering will be applied
     * @return a list of maps where each map represents sales data for a specific month
     *         including keys for the month (name), total sales (sales), and total discounts (discount)
     */
    @Query("""
        select month(o.lastModifiedDate) as name,
            coalesce(sum(distinct od.discount), 0) as discount,
            coalesce(sum(distinct o.total) , 0) as sales
        from OrderReceipt o
        join o.details od
        left join od.shop s
        where od.status = com.ring.bookstore.model.enums.OrderStatus.COMPLETED
        and (coalesce(:shopId) is null or s.id = :shopId)
        and (coalesce(:userId) is null or s.owner.id = :userId)
        and (coalesce(:year) is null or year(o.lastModifiedDate) = :year)
        group by month(o.lastModifiedDate)
    """)
    List<Map<String, Object>> getMonthlySales(Long shopId,
                                              Long userId,
                                              Integer year); //Get monthly sale
}
