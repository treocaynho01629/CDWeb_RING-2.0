package com.ring.bookstore.model;

import com.ring.bookstore.enums.UserRole;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "\"role\"")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Byte id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserRole roleName;

    @ManyToMany(fetch = FetchType.LAZY,
            mappedBy = "roles")
    private Collection<Account> users;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "roles_privileges",
            joinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "privilege_id", referencedColumnName = "id"))
    private Collection<Privilege> privileges;

    public void addUser(Account user) {
        this.users.add(user);
        user.getRoles().add(this);
    }

    public void removeUser(Account user) {
        this.users.add(user);
        user.getRoles().remove(this);
    }

    public void addPrivilege(Privilege privilege) {
        this.privileges.add(privilege);
        privilege.getRoles().add(this);
    }

    public void removePrivilege(Privilege privilege) {
        this.privileges.add(privilege);
        privilege.getRoles().remove(this);
    }
}
