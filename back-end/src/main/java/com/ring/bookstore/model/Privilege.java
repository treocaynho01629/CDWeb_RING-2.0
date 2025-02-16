package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ring.bookstore.enums.PrivilegeName;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;

@Entity
@Getter
@Setter
@EqualsAndHashCode
public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PrivilegeName privilegeName;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "privileges")
    @JsonIgnore
    private Collection<Role> roles;

    public void addRole(Role role) {
        this.roles.add(role);
        role.getPrivileges().add(this);
    }

    public void removeRole(Role role) {
        this.roles.add(role);
        role.getPrivileges().remove(this);
    }
}
