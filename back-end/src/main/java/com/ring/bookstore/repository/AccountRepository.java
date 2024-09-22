package com.ring.bookstore.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{
	
	boolean existsByUsername(String username); //Check exists Account by {username}
	
	Optional<Account> findByUsername(String username); //Get Account by {username}
	
	List<Account> findByEmail(String email); //Get Account by {email}
	
	Optional<Account> findByResetPassToken(String resetPassToken); //Get Account by {resetPassToken}
	
	@Query("""
	select a from Account a left join fetch AccountProfile p on a.id = p.user.id
	where concat (a.email, a.username) ilike %:keyword%
	and size(a.roles) <= :maxRoles
	and size(a.roles) > :minRoles
	""")
	Page<Account> findAccountsWithFilter(String keyword, Integer maxRoles, Integer minRoles, Pageable pageable);
	
	@Query(value ="""
	select t.username as name, coalesce(t.rv, 0) as reviews, coalesce(t2.od, 0) as orders, coalesce(t2.sp, 0) as spends
	from
	(select a.username, r.user_id, count(r.id) as rv
	from review r join account a on a.id = r.user_id
	group by a.username, r.user_id order by rv desc) t
	left join
	(select o2.user_id, sum(o.amount) as od, sum(o.amount * o.price) as sp\s
	from order_receipt o2 join order_detail o on o2.id = o.order_id
	group by o2.user_id order by od DESC) t2\s
	on t.user_id = t2.user_id
	order BY orders desc limit 7
	""", nativeQuery = true)
	List<Map<String,Object>> getTopUser(); //Top 7 users base on receipts and reviews
	
	@Query("""
	select a.username as name, coalesce(sum(o.amount), 0) as books, coalesce(sum(o.amount * o.price), 0) as sales
	from Account a join Book b on a.id = b.shop.owner.id 
	left join OrderDetail o on b.id = o.book.id
	group by a.username
	order by sales desc
	""")
	List<Map<String,Object>> getTopSeller(); //Top sellers base on sale (username, total amount sold, total sales)
}
