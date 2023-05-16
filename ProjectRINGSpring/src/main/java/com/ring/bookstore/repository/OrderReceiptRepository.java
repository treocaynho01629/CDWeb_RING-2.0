package com.ring.bookstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.OrderReceipt;

@Repository
public interface OrderReceiptRepository extends JpaRepository<OrderReceipt, Integer>{
	
	@Query("""
	select case when count(or) > 0 then true else false end 
	from OrderReceipt or join OrderDetail od on or.id = od.order.id
	where or.user.userName = :userName and od.book.id = :id
	""")
	boolean existsByUserBuyBook(Integer id, String userName);
	
	Page<OrderReceipt> findAllByUser_Id(Integer id, Pageable pageable);
	
	@Query("""
	select o from OrderReceipt o join OrderDetail od on o.id = od.order.id 
	where od.book.user.id = :id
	""")
	Page<OrderReceipt> findAllBySeller(Integer id, Pageable pageable);
	
	@Query("""
	select o from OrderReceipt o join OrderDetail od on o.id = od.order.id 
	where od.book.id = :id
	""")
	Page<OrderReceipt> findAllByBookId(Integer id, Pageable pageable);
}
