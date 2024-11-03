package com.ring.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.OrderDetail;

import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long>{

    @Query("""
        select od from OrderDetail od join fetch OrderReceipt o on od.order.id = o.id 
        where od.id = :id
	""")
    Optional<OrderDetail> findDetailById(Long id);

}
