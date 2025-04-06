package com.ring.bookstore.repository;

import com.ring.bookstore.model.entity.PrivilegeGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PrivilegeGroupRepository extends JpaRepository<PrivilegeGroup, Integer> {

    Optional<PrivilegeGroup> findByGroupName(String name);
}
