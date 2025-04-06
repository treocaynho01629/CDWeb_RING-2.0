package com.ring.bookstore.model.entity;

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
public class PrivilegeGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    @Nationalized
    private String groupName;

    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "group",
            fetch = FetchType.EAGER)
    private Collection<Privilege> groupPrivileges;
}
