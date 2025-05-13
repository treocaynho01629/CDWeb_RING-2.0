package com.ring.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.*;

/**
 * Represents an entity as {@link Account} for users.
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE Account SET active = false WHERE id=?")
@SQLRestriction("active=true")
@EqualsAndHashCode(callSuper = true)
public class Account extends Auditable implements UserDetails {

	@Serial
	private static final long serialVersionUID = 1L;

	@Id
	@Column(nullable = false, updatable = false)
	@SequenceGenerator(name = "primary_sequence", sequenceName = "primary_sequence", allocationSize = 1, initialValue = 10000)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "primary_sequence")
	private Long id;

	@Column(unique = true, nullable = false, length = 30)
	private String username;

	@Column(nullable = false, length = 500)
	@JsonIgnore
	private String pass;

	@Column(unique = true, nullable = false, length = 100)
	private String email;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user", orphanRemoval = true, optional = false)
	@PrimaryKeyJoinColumn
	@JsonIgnore
	@EqualsAndHashCode.Exclude
	private AccountProfile profile;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	@JsonIgnore
	private Collection<Role> roles;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<RefreshToken> refreshTokens = new ArrayList<>();

	@Column(unique = true)
	@JsonIgnore
	private String resetToken;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "owner", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Shop> shops;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Review> userReviews;

	@OneToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "user", fetch = FetchType.LAZY)
	@JsonIgnore
	private List<OrderReceipt> userOrderReceipts;

	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "followers")
	@JsonIgnore
	@EqualsAndHashCode.Exclude
	private Set<Shop> following = new HashSet<>();

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return getGrantedAuthorities(getPrivileges());
	}

	private List<String> getPrivileges() {
		Set<String> privileges = new HashSet<>();
		List<Privilege> collection = new ArrayList<>();
		for (Role role : this.roles) {
			privileges.add(role.getRoleName().name());
			collection.addAll(role.getPrivileges());
		}
		for (Privilege item : collection) {
			privileges.add(item.getPrivilegeType().getPrivilege());
		}
		return privileges.stream().toList();
	}

	private List<GrantedAuthority> getGrantedAuthorities(List<String> privileges) {
		List<GrantedAuthority> authorities = new ArrayList<>();
		for (String privilege : privileges) {
			authorities.add(new SimpleGrantedAuthority(privilege));
		}
		return authorities;
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

	public void setProfile(AccountProfile profile) {
		if (profile == null) {
			if (this.profile != null) {
				this.profile.setUser(null);
			}
		} else {
			profile.setUser(this);
		}
		this.profile = profile;
	}

	public void addShop(Shop shop) {
		this.shops.add(shop);
		shop.setOwner(this);
	}

	public void removeShop(Shop shop) {
		this.shops.remove(shop);
		shop.setOwner(null);
	}

	public void removeAllShops() {
		shops.forEach(shop -> shop.setOwner(null));
		this.shops.clear();
	}

	public void addOrder(OrderReceipt receipt) {
		this.userOrderReceipts.add(receipt);
		receipt.setUser(this);
	}

	public void removeOrder(OrderReceipt receipt) {
		this.userOrderReceipts.remove(receipt);
		receipt.setUser(null);
	}

	public void removeAllOrders() {
		userOrderReceipts.forEach(order -> order.setUser(null));
		this.userOrderReceipts.clear();
	}

	public void addReview(Review review) {
		this.userReviews.add(review);
		review.setUser(this);
	}

	public void removeReview(Review review) {
		this.userReviews.remove(review);
		review.setUser(null);
	}

	public void removeAllReviews() {
		userReviews.forEach(review -> review.setUser(null));
		this.userReviews.clear();
	}

	public void addRole(Role role) {
		this.roles.add(role);
		role.getUsers().add(this);
	}

	public void removeRole(Role role) {
		this.roles.add(role);
		role.getUsers().remove(this);
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

	public void removeAllFollowings() {
		following.forEach(shop -> shop.removeFollower(this));
		this.following.clear();
	}

	public void addRefreshToken(RefreshToken token) {
		this.refreshTokens.add(token);
		token.setUser(this);
	}

	public void removeRefreshToken(RefreshToken token) {
		this.refreshTokens.remove(token);
		token.setUser(null);
	}

	public void removeAllRefreshTokens() {
		refreshTokens.forEach(token -> token.setUser(null));
		this.refreshTokens.clear();
	}
}
