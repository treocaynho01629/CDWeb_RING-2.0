package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.accounts.IAccountDetail;
import com.ring.bookstore.dtos.accounts.IProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ring.bookstore.model.AccountProfile;

import java.util.Optional;

@Repository
public interface AccountProfileRepository extends JpaRepository<AccountProfile, Long>{
    @Query("""
        select p.name as name, p.phone as phone, p.gender as gender, p.dob as dob,
        a.email as email, p.image.name as image, a.createdDate as joinedDate,
        size(a.following) as totalFollows, size(a.userReviews) as totalReviews
        from Account a left join a.profile p left join p.image i
        where a.id = :userId
    """)
    Optional<IProfile> findProfileByUser(Long userId);

    @Query("""
		select a.id as id, a.username as username, i.name as image,
		a.email as email, p.name as name, p.phone as phone,
		size(a.roles) as roles, p.gender as gender, p.dob as dob,
		a.createdDate as joinedDate, size(a.following) as totalFollows, size(a.userReviews) as totalReviews
		from Account a
		left join a.profile p
		left join p.image i
		where a.id = :id
	""")
    Optional<IAccountDetail> findDetailById(Long id);
}
