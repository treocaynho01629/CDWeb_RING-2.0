package com.ring.bookstore.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.OrderReceipt;

@Repository
public interface OrderReceiptRepository extends JpaRepository<OrderReceipt, Long>{
	
	@Query("""
	select case when count(or) > 0 then true else false end 
	from OrderReceipt or join OrderDetail od on or.id = od.order.id
	where or.user.userName = :userName and od.book.id = :id
	""")
	boolean existsByUserBuyBook(Long id, String userName); //Check if user have bought this book before
	
	Page<OrderReceipt> findAllByUser_Id(Long id, Pageable pageable); //Get orders from user's {id}
	
	@Query("""
	select o from OrderReceipt o join OrderDetail od on o.id = od.order.id 
	where od.book.seller.id = :id
	""")
	Page<OrderReceipt> findAllBySeller(Long id, Pageable pageable); //Get orders by seller's {id}
	
	@Query("""
	select o from OrderReceipt o join OrderDetail od on o.id = od.order.id 
	where od.book.id = :id
	""")
	Page<OrderReceipt> findAllByBookId(Long id, Pageable pageable); //Get orders with book's {id}
	
	@Query("""
	select month(o.oDate) as name, coalesce(sum(o2.amount) , 0) as books, coalesce(sum(distinct o.total) , 0) as sales 
	from OrderReceipt o left join OrderDetail o2 on o.id = o2.order.id
	group by month(o.oDate)
	""")
	List<Map<String,Object>> getMonthlySale(); //Get monthly sale
	
	@Query("""
	select month(o.oDate) as name, coalesce(sum(o2.amount) , 0) as books, coalesce(sum(distinct o.total) , 0) as sales 
	from OrderReceipt o left join OrderDetail o2 on o.id = o2.order.id join Book b on b.id = o2.book.id
	where b.seller.id = :id
	group by month(o.oDate)
	""")
	List<Map<String,Object>> getMonthlySaleBySeller(Long id); //Get monthly sale by seller's {id}
}
