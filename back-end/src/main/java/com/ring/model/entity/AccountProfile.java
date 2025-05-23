package com.ring.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ring.model.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.List;

/**
 * Represents an entity as {@link AccountProfile} for user's profile.
 */
@Entity
@Getter
@Setter
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
    private Long id;
	
	@Column(length = 250)
	@Nationalized 
    private String name;

	@Column(length = 15)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private Gender gender;

    @Column
    private LocalDate dob;

    @OneToOne(fetch = FetchType.LAZY,
            orphanRemoval = true,
            cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Image image;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Account user;

    @OneToOne(fetch = FetchType.LAZY,
            orphanRemoval = true,
            cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Address address; //Main address

    @OneToMany(cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "profile",
            fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Address> addresses;

    public void addAddress(Address address) {
        addresses.add(address);
        address.setProfile(this);
    }

    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setProfile(null);
    }

    public void removeAllAddresses() {
        addresses.forEach(address -> address.setProfile(null));
        this.addresses.clear();
    }
}
