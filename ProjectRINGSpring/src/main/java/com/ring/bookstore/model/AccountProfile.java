package com.ring.bookstore.model;

import jakarta.persistence.*;
import java.time.LocalDate;

import org.hibernate.annotations.Nationalized;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class AccountProfile {
	@Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    @JsonIgnore
    private Integer id;
	
	@Column(length = 250)
	@Nationalized 
    private String name;

	@Column(length = 15)
    private String phone;

    @Column(length = 10)
    @Nationalized 
    private String gender;

    @Column
    private LocalDate dob;

    @Column(length = 500)
    @Nationalized 
    private String address;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private Account user;
}
