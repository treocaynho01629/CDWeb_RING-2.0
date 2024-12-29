package com.ring.bookstore.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import com.ring.bookstore.dtos.accounts.IAccount;
import com.ring.bookstore.dtos.dashboard.IStat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{
	
	boolean existsByUsernameOrEmail(String username, String email);

	@Query("""
		select a from Account a join fetch a.roles r
		where a.username = :username
	""")
	Optional<Account> findByUsername(String username); //Get Account by {username}

	Optional<Account> findByEmail(String email); //Get Account by {email}

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
		a.email as email, p.name as name, ad.phone as phone, size(a.roles) as roles
		from Account a
		left join a.profile p
		left join p.address ad
		left join p.image i
		where concat (a.email, a.username) ilike %:keyword%
		and (coalesce(:roles) is null or size(a.roles) = :roles)
	""")
	Page<IAccount> findAccountsWithFilter(String keyword, Short roles, Pageable pageable);

//	@Query(value ="""
//		select t.username as name, coalesce(t.rv, 0) as reviews, coalesce(t2.od, 0) as orders, coalesce(t2.sp, 0) as spends
//		from
//		(select a.username, r.user_id, count(r.id) as rv
//		from review r join account a on a.id = r.user_id
//		group by a.username, r.user_id order by rv desc) t
//		left join
//		(select o2.user_id, sum(o.amount) as od, sum(o.amount * o.price) as sp\s
//		from order_receipt o2 join order_detail o on o2.id = o.order_id
//		group by o2.user_id order by od DESC) t2\s
//		on t.user_id = t2.user_id
//		order by orders desc limit 7
//	""", nativeQuery = true)
//	List<Map<String,Object>> getTopUser(); //Top 7 users base on receipts and reviews
//
//	@Query("""
//		select a.username as name, coalesce(sum(o.quantity), 0) as books, coalesce(sum(o.quantity * o.price), 0) as sales
//		from Account a join Book b on a.id = b.shop.owner.id
//		left join OrderItem o on b.id = o.book.id
//		group by a.username
//		order by sales desc
//	""")
//	List<Map<String,Object>> getTopSeller(); //Top sellers base on sale (username, total amount sold, total sales)
}
