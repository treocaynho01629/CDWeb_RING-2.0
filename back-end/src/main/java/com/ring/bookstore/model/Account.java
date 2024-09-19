package com.ring.bookstore.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
public class Account implements UserDetails {

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
    private String userName;

    @Column(nullable = false, length = 500)
    @JsonIgnore
    private String pass;

    @Column(nullable = false, length = 1000)
    private String email;

	@OneToOne(cascade = CascadeType.ALL,
			fetch = FetchType.LAZY,
			orphanRemoval = true)
	@JoinColumn(name = "image_id")
	private Image image;
    
    @Column(unique = true)
    @JsonIgnore
    private String resetPassToken;
    
    @Column(nullable = true)
    @JsonIgnore
	private LocalDateTime tokenCreationDate;

    @OneToOne(cascade = CascadeType.ALL, 
    		orphanRemoval = true, 
    		mappedBy = "user")
    private AccountProfile profile;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(	name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    @JsonIgnore
    private Set<Role> roles;

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinTable(	name = "following",
			joinColumns = @JoinColumn(name = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "follower_id"))
	@JsonIgnore
	private List<Account> followers;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "seller", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Book> sellBooks;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> userReviews;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderReceipt> userOrderReceipts;

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
		return this.userName;
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
		return true;
	}
	
	public void removeAllOrders() {
		userOrderReceipts.forEach(order -> order.setUser(null));
        this.userOrderReceipts.clear();
    }
	
	public void removeAllReviews() {
        userReviews.forEach(review -> review.setUser(null));
        this.userReviews.clear();
    }
	
	public void removeAllBooks() {
		sellBooks.forEach(book -> book.setSeller(null));
        this.sellBooks.clear();
    }
	
	public void removeAllRoles() {
        this.roles.clear();
    }
}
