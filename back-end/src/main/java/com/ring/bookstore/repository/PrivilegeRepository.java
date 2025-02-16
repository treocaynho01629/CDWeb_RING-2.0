package com.ring.bookstore.repository;

import com.ring.bookstore.enums.PrivilegeName;
import com.ring.bookstore.model.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PrivilegeRepository extends JpaRepository<Privilege, Integer> {

    Optional<Privilege> findByPrivilegeName(PrivilegeName name);
}
