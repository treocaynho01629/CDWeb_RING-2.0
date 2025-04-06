package com.ring.bookstore.model.entity;

import com.ring.bookstore.model.enums.UserRole;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.util.Collection;

/**
 * Represents an entity as {@link Role} for roles.
 */
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

    @Column(length = 200)
    @Nationalized
    private String label;

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
