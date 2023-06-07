package com.ring.bookstore.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.Account;
import com.ring.bookstore.response.IChartResponse;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer>{
	
	boolean existsByUserName(String userName); //Kiểm tra Người dùng theo Tên đăng nhập
	
	Optional<Account> findByUserName(String userName); //Tìm Người dùng theo Tên đăng nhập
	
	List<Account> findByEmail(String email); //Tìm Người dùng theo Email
	
	Optional<Account> findByResetPassToken(String resetPassToken); //Tìm Người dùng theo Reset Token
	
	@Query("""
	select a from Account a where size(a.roles) > 1
	""")
	Page<Account> findEmployees(Pageable pageable);
	
	@Query(value ="""
	select t.user_name as name, coalesce(t.rv, 0) as data, coalesce(t2.od, 0) as otherData
	from
	(SELECT a.user_name, r.user_id, count(r.id) as rv
	from review r join account a on a.id = r.user_id
	group by a.user_name, r.user_id order by rv desc limit 7) t
	left join
	(select o2.user_id, sum(o.amount) as od
	from order_receipt o2 join order_detail o on o2.id = o.order_id
	group by o2.user_id order by od DESC limit 7) t2 on t.user_id = t2.user_id
	order BY otherData desc
	""", nativeQuery = true)
	List<IChartResponse> getTopUser(); //Tìm Top 7 Người dùng (Đặt hàng nhiều và Đánh giá nhiều)
	
	@Query("""
	select a.userName as name, count(b.id) as data, coalesce(sum(o.amount), 0) as otherData 
	from Account a join Book b on a.id = b.user.id 
	left join OrderDetail o on b.id = o.book.id
	group by a.userName
	order by data desc
	""")
	List<IChartResponse> getTopSeller(); //Tìm Top Nhân viên (Bán nhiều và Doanh thu nhiều)
}
