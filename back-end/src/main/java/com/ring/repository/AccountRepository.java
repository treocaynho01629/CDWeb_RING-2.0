package com.ring.repository;

import com.ring.dto.projection.accounts.IAccount;
import com.ring.dto.projection.dashboard.IStat;
import com.ring.model.entity.Account;
import com.ring.model.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface named {@link AccountRepository} for managing {@link Account} entities.
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{
	
	/**
	 * Checks if a user exists with the given username or email.
	 *
	 * @param username the username to check for existence
	 * @param email the email to check for existence
	 * @return true if a user exists with the given username or email, false otherwise
	 */
	boolean existsByUsernameOrEmail(String username, String email);

	/**
	 * Finds an Account entity by its email address.
	 *
	 * @param email the email address of the account to be retrieved
	 * @return an Optional containing the Account entity if found, or an empty Optional if not found
	 */
	Optional<Account> findByEmail(String email);

	/**
	 * Fetches an account entity along with its roles by the specified username.
	 *
	 * @param username the username of the account to be retrieved
	 * @return an {@code Optional} containing the account if found, or an empty {@code Optional} if not found
	 */
	@Query("""
		select a from Account a
		join fetch a.roles r
		where a.username = :username
	""")
	Optional<Account> findByUsername(String username);

	/**
	 * Retrieves an optional {@link Account} entity based on the specified refresh token and username.
	 * The query joins the associated roles and refresh tokens to fetch the account details.
	 *
	 * @param token the refresh token associated with the account
	 * @param username the username associated with the account
	 * @return an {@link Optional} containing the matching {@link Account} if found, or an empty {@link Optional} if no match is found
	 */
	@Query("""
		select a from Account a
		join a.refreshTokens t
		join fetch a.roles r
		where t.refreshToken = :token
		and a.username = :username
	""")
	Optional<Account> findByRefreshTokenAndUsername(String token, String username);

	/**
	 * Finds an account based on the provided reset token.
	 *
	 * @param token the reset token associated with the account.
	 * @return an {@code Optional} containing the account if found, or {@code Optional.empty()} if not found.
	 */
	Optional<Account> findByResetToken(String token);

	/**
	 * Finds a list of account IDs that match the given criteria but are excluded
	 * from the specified list of IDs.
	 *
	 * @param keyword A string used to search for accounts by email or username.
	 *                The provided keyword is checked in a case-insensitive manner.
	 * @param role    An optional user role used to filter the accounts. If the role
	 *                is null, this criterion is ignored.
	 * @param ids     A list of IDs to exclude from the search.
	 * @return A list of IDs of accounts that match the criteria but do not belong
	 *         to the excluded list.
	 */
	@Query("""
		select a.id from Account a
		join a.roles r
		where concat (a.email, a.username) ilike %:keyword%
		and (coalesce(:role) is null or r.roleName = :role)
		and a.id not in :ids
		group by a.id
	""")
	List<Long> findInverseIds(String keyword, UserRole role, List<Long> ids);

	/**
	 * Retrieves analytics data for accounts, including total accounts created in the last two months,
	 * accounts created in the current month, and accounts created in the previous month.
	 *
	 * @return an IStat projection object containing the total number of accounts, the count of accounts
	 *         created in the current month, and the count of accounts created in the previous month.
	 */
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

	/**
	 * Retrieves a paginated list of accounts based on the provided filters.
	 *
	 * @param keyword the search keyword used to filter accounts by their email or username
	 * @param role the user role used to filter accounts; if null, this filter is ignored
	 * @param pageable pagination information to limit and sort the results
	 * @return a page of projections containing account information, including ID, username, email, profile name, phone, roles, and associated image
	 */
	@Query("""
		select distinct t.id as id, t.username as username, t.email as email, p.name as name,
			p.phone as phone, t.roles as roles, i as image, t.createdDate as createdDate
		from (select a.id as id, a.username as username, a.email as email, a.createdDate as createdDate,
			array_agg(r.roleName) over (partition by a.id order by a.id) as roles
			from Account a
			join a.roles r
			where concat (a.email, a.username) ilike %:keyword%
			and (coalesce(:role) is null or r.roleName = :role)
			group by a.id, r.roleName) t
		left join AccountProfile p on p.id = t.id
		left join p.image i
	""")
	Page<IAccount> findAccountsWithFilter(String keyword, UserRole role, Pageable pageable);

	/**
	 * Clears the reset token for an account by setting it to null.
	 *
	 * @param token the reset token to search for and clear from the account
	 */
	@Modifying
	@Query("""
        update Account a
        set a.resetToken = null
        where a.resetToken = :token
    """)
	void clearResetToken(String token);
}
