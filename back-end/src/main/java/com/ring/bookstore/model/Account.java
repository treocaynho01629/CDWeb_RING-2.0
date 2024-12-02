package com.ring.bookstore.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE Product SET active = false WHERE id=?")
@SQLRestriction("active=true")
@EqualsAndHashCode(callSuper = true)
public class Account extends Auditable implements UserDetails {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

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
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String username;

    @Column(nullable = false, length = 500)
    @JsonIgnore
    private String pass;

    @Column(nullable = false, length = 1000)
    private String email;

    @Column(unique = true)
    @JsonIgnore
    private String resetPassToken;
    
    @Column
    @JsonIgnore
	private LocalDateTime tokenCreationDate;

    @OneToOne(cascade = CascadeType.ALL, 
    		orphanRemoval = true, 
    		mappedBy = "user")
	@JsonManagedReference
    @EqualsAndHashCode.Exclude
	private AccountProfile profile;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(	name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    @JsonIgnore
    private Collection<Role> roles;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "owner", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Shop> shops;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> userReviews;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderReceipt> userOrderReceipts;

	@ManyToMany(mappedBy = "followers")
	@JsonIgnore
	@EqualsAndHashCode.Exclude
	private Set<Shop> following = new HashSet<>();

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName().name())).collect(Collectors.toList());
	}

	@Override
	@JsonIgnore
	public String getPassword() {
		return this.pass;
	}

	@Override
	public String getUsername() {
		return this.username;
	}
	
	@Override
	@JsonIgnore
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isEnabled() {
		return this.isActive();
	}
	
	public void removeAllOrders() {
		userOrderReceipts.forEach(order -> order.setUser(null));
        this.userOrderReceipts.clear();
    }
	
	public void removeAllReviews() {
        userReviews.forEach(review -> review.setUser(null));
        this.userReviews.clear();
    }

	public void removeAllRoles() {
        this.roles.clear();
    }

	public void followShop(Shop shop) {
		this.following.add(shop);
	}

	public void unfollowShop(Shop shop) {
		this.following.remove(shop);
	}
}
