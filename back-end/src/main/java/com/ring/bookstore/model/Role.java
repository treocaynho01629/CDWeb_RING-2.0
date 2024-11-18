package com.ring.bookstore.model;

import com.ring.bookstore.enums.RoleName;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;


@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(name = "\"role\"")
public class Role {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RoleName roleName;

    @ManyToMany(mappedBy = "roles")
    private Collection<Account> users;
}
