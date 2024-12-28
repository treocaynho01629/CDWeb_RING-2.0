package com.ring.bookstore.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.ring.bookstore.dtos.dashboard.IStat;
import com.ring.bookstore.dtos.orders.IReceiptSummary;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.model.OrderDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.OrderReceipt;

@Repository
public interface OrderReceiptRepository extends JpaRepository<OrderReceipt, Long> {

    @Query("""
        select case when count(o) > 0 then true else false end
        from OrderReceipt o
        join o.details od
        join od.items oi
        where o.user.username = :username and oi.book.id = :id
    """)
    boolean hasUserBuyBook(Long id, String username); //Check if user have bought this book before

    @Query(value = """
        select distinct o.id as id, i.name as image, a.name as name,
        o.createdDate as date, o.total - o.totalDiscount as totalPrice,
        sum(oi.quantity) as totalItems
        from OrderReceipt o
        join o.details od
        join o.address a
        join od.items oi
        join o.user u
        left join u.profile p
        left join p.image i
        where (coalesce(:shopId) is null or od.shop.id = :shopId)
        and (coalesce(:userId) is null or od.shop.owner.id = :userId)
        and (coalesce(:bookId) is null or oi.book.id = :bookId)
        group by o.id, i.name, a.name, o.createdDate
    """,
    countQuery = """
        select count(o.id)
        from OrderReceipt o
        join o.details od
        join od.items oi
        where (coalesce(:shopId) is null or od.shop.id = :shopId)
        and (coalesce(:userId) is null or od.shop.owner.id = :userId)
        and (coalesce(:bookId) is null or oi.book.id = :bookId)
    """)
    Page<IReceiptSummary> findAllSummaries(Long shopId, Long userId, Long bookId, Pageable pageable);

    @Query("""
        select distinct o from OrderReceipt o
        join fetch o.details od
        join fetch o.user u
        join fetch o.address a
        join fetch od.items oi
        where od.shop.id = :shopId
        and (coalesce(:userId) is null or od.shop.owner.id = :userId)
    """)
    Page<OrderReceipt> findAllByUsersShop(Long shopId, Long userId, Pageable pageable);

    //Exclude shipping fee?
    @Query("""
        select t.currentMonth as total, t.currentMonth as currentMonth, t.lastMonth as lastMonth
        from (select coalesce(sum(case when o.createdDate >= date_trunc('month', current date)
                    then (od.totalPrice - od.discount) end), 0) as currentMonth,
            coalesce(sum(case when o.createdDate >= date_trunc('month', current date) - 1 month
                and o.createdDate < date_trunc('month', current date)
                    then (od.totalPrice - od.discount) end), 0) lastMonth
            from OrderDetail od join od.order o
            where od.status = com.ring.bookstore.enums.OrderStatus.COMPLETED
            and o.createdDate >= date_trunc('month', current date) - 1 month
            and (coalesce(:shopId) is null or od.shop.id = :shopId)
            and (coalesce(:userId) is null or od.shop.owner.id = :userId)
        ) t
    """)
    IStat getSalesAnalytics(Long shopId, Long userId);

    @Query("""
        select month(o.createdDate) as name,
            coalesce(sum(distinct od.discount), 0) as discount,
            coalesce(sum(distinct o.total) , 0) as sales
        from OrderReceipt o
        join o.details od
        where od.status = com.ring.bookstore.enums.OrderStatus.COMPLETED
        and (coalesce(:shopId) is null or od.shop.id = :shopId)
        and (coalesce(:userId) is null or od.shop.owner.id = :userId)
        and (coalesce(:year) is null or year(o.createdDate) = :year)
        group by month(o.createdDate)
    """)
    List<Map<String, Object>> getMonthlySales(Long shopId, Long userId, Integer year); //Get monthly sale
}
