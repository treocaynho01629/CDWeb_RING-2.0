package com.ring.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.util.Collection;

/**
 * Represents an entity as {@link PrivilegeGroup} for privilege groups.
 */
@Entity
@Getter
@Setter
@Builder
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class PrivilegeGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    @Nationalized
    private String groupName;

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "group",
            fetch = FetchType.EAGER)
    private Collection<Privilege> groupPrivileges;

    public void addPrivilege(Privilege privilege) {
        this.groupPrivileges.add(privilege);
        privilege.setGroup(this);
    }

    public void removePrivilege(Privilege privilege) {
        this.groupPrivileges.remove(privilege);
        privilege.setGroup(null);
    }

    public void removeAllPrivileges() {
        groupPrivileges.forEach(privilege -> privilege.setGroup(null));
        this.groupPrivileges.clear();
    }
}
