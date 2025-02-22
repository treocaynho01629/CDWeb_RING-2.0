package com.ring.bookstore.repository;

import java.util.List;
import java.util.Optional;

import com.ring.bookstore.dtos.accounts.IAccount;
import com.ring.bookstore.dtos.dashboard.IStat;
import com.ring.bookstore.enums.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{
	
	boolean existsByUsernameOrEmail(String username, String email);

	@Query("""
		select a from Account a
		join fetch a.roles r
		where a.username = :username
	""")
	Optional<Account> findByUsername(String username);

	Optional<Account> findByEmail(String email);

	@Query("""
		select a from Account a
		join a.refreshTokens t
		join fetch a.roles r
		where t.refreshToken = :token
		and a.username = :username
	""")
	Optional<Account> findByRefreshTokenAndUsername(String token, String username);

	Optional<Account> findByResetToken(String token);

	@Query("""
		select a.id from Account a
		join a.roles r
		where concat (a.email, a.username) ilike %:keyword%
		and (coalesce(:role) is null or r.roleName = :role)
		and a.id not in :ids
		group by a.id
	""")
	List<Long> findInverseIds(String keyword, RoleName role, List<Long> ids);

	@Query("""
        select t.currentMonth as total, t.currentMonth as currentMonth, t.lastMonth as lastMonth
        from (select count(a.id) as total,
			count(case when a.createdDate >= date_trunc('month', current date) then 1 end) as currentMonth,
			count(case when a.createdDate >= date_trunc('month', current date) - 1 month
				and a.createdDate < date_trunc('month', current date) then 1 end) lastMonth
			from Account a
			where a.createdDate >= date_trunc('month', current date) - 1 month
        ) t
   	""")
	IStat getAccountAnalytics();

	@Query("""
		select a.id as id, a.username as username, i.name as image,
		a.email as email, p.name as name, p.phone as phone, a.roles as roles
		from Account a
		left join a.profile p
		left join p.image i
		join a.roles r
		where concat (a.email, a.username) ilike %:keyword%
		and (coalesce(:role) is null or r.roleName = :role)
	""")
	Page<IAccount> findAccountsWithFilter(String keyword, RoleName role, Pageable pageable);

	@Modifying
	@Query("""
        update Account a
        set a.resetToken = null
        where a.resetToken = :token
    """)
	void clearResetToken(String token);
}
