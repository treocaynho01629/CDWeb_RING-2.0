package com.ring.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.OrderReceipt;

@Repository
public interface OrderReceiptRepository extends JpaRepository<OrderReceipt, Long>{
}
