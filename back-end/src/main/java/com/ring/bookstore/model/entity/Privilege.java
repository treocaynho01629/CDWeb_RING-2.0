package com.ring.bookstore.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ring.bookstore.model.enums.PrivilegeType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.util.Collection;

@Entity
@Getter
@Setter
@Builder
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    @Nationalized
    private String label;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PrivilegeType privilegeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    @JsonIgnore
    private PrivilegeGroup group;

    @ManyToMany(fetch = FetchType.LAZY,
            mappedBy = "privileges")
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
