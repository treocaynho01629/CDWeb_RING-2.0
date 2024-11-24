package com.ring.bookstore.repository;

import com.ring.bookstore.dtos.projections.IProfile;
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

}
