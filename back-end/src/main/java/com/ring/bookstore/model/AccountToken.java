package com.ring.bookstore.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String refreshToken;

    @OneToOne(fetch = FetchType.LAZY)  //Un-directional
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Account user;
}
