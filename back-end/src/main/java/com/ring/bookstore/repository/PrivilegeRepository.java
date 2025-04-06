package com.ring.bookstore.repository;

import com.ring.bookstore.model.enums.PrivilegeType;
import com.ring.bookstore.model.entity.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PrivilegeRepository extends JpaRepository<Privilege, Integer> {

    Optional<Privilege> findByPrivilegeType(PrivilegeType type);
}
