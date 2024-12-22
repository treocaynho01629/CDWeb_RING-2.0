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

    @Column(unique = true)
    private String refreshToken;

    @Column(unique = true)
    private String resetToken;

    @OneToOne(fetch = FetchType.LAZY)  //Un-directional
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Account user;
}
