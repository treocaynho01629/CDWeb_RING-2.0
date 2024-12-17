package com.ring.bookstore.repository;

import java.util.List;
import java.util.Map;

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

    @Query("""
        select distinct o from OrderReceipt o
        join fetch o.details od
        join od.items oi
        where od.shop.owner.id = :id
    """)
    Page<OrderReceipt> findAllBySellerId(Long id, Pageable pageable); //Get orders by seller's {id}

    @Query("""
        select month(o.createdDate) as name, coalesce(sum(o3.quantity), 0) as books, coalesce(sum(distinct o.total) , 0) as sales 
        from OrderReceipt o left join OrderDetail o2 on o.id = o2.order.id 
        left join OrderItem o3 on o2.id = o3.detail.id
        group by month(o.createdDate)
    """)
    List<Map<String, Object>> getMonthlySale(); //Get monthly sale

    @Query("""
        select month(o.createdDate) as name, coalesce(sum(o3.quantity), 0) as books, coalesce(sum(distinct o.total) , 0) as sales 
        from OrderReceipt o left join OrderDetail o2 on o.id = o2.order.id 
        left join OrderItem o3 on o2.id = o3.detail.id join Book b on b.id = o3.book.id
        where b.shop.owner.id = :id
        group by month(o.createdDate)
    """)
    List<Map<String, Object>> getMonthlySaleBySeller(Long id); //Get monthly sale by seller's {id}

    @Query("""
        select month(o.createdDate) as name, coalesce(sum(o3.quantity), 0) as books, coalesce(sum(distinct o.total) , 0) as sales 
        from OrderReceipt o left join OrderDetail o2 on o.id = o2.order.id 
        left join OrderItem o3 on o2.id = o3.detail.id join Book b on b.id = o3.book.id
        where b.shop.id = :id
        group by month(o.createdDate)
    """)
    List<Map<String, Object>> getMonthlySaleByShop(Long id); //Get monthly sale by shop's {id}
}
