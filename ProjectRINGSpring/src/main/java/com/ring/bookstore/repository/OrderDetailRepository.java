package com.ring.bookstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.OrderDetail;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer>{
	
	void deleteByBook_Id(Integer id); //Delete OrderDetail by book's {id}
	List<OrderDetail> findByOrder_Id(Integer id); //Find OrderDetail by order's {id}
}
