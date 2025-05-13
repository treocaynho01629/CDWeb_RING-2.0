package com.ring.repository;

import com.ring.dto.projection.accounts.IAccountDetail;
import com.ring.dto.projection.accounts.IProfile;
import com.ring.model.entity.AccountProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface named {@link AccountProfileRepository} for managing {@link AccountProfile} entities.
 */
@Repository
public interface AccountProfileRepository extends JpaRepository<AccountProfile, Long>{

	/**
	 * Retrieves profile details for a specific user identified by their user ID.
	 * The method fetches details such as the user's name, phone number, gender, date of birth,
	 * email, account creation date, total number of follows, total number of reviews,
	 * and associated profile image.
	 *
	 * @param userId the unique identifier of the user whose profile is to be retrieved.
	 * @return an {@code Optional} containing {@code IProfile}, which provides a projection
	 *         of the user's profile details, or an empty {@code Optional} if no profile
	 *         exists for the given user ID.
	 */
	@Query("""
        select p.name as name, p.phone as phone, p.gender as gender,
			p.dob as dob, a.email as email, a.createdDate as joinedDate,
			size(a.following) as totalFollows, size(a.userReviews) as totalReviews,
			i as image
        from Account a left join a.profile p left join p.image i
        where a.id = :userId
    """)
    Optional<IProfile> findProfileByUser(Long userId);

    /**
	 * Retrieves detailed account information for a specific account ID.
	 * The method returns an optional projection of account details, including
	 * user information, profile attributes, and related metadata.
	 *
	 * @param id the unique identifier of the account for which details are to be retrieved
	 * @return an Optional containing {@link IAccountDetail} if the account exists,
	 *         or an empty Optional if no account is found with the specified ID
	 */
	@Query("""
		select distinct a.id as id, a.username as username, a.email as email,
			p.name as name, p.phone as phone,
			array_agg(r.roleName) over (partition by a.id order by a.id) as roles,
			p.gender as gender, p.dob as dob, a.createdDate as joinedDate,
			size(a.following) as totalFollows, size(a.userReviews) as totalReviews,
			i as image
		from Account a
		left join a.profile p
		left join p.image i
		join a.roles r
		where a.id = :id
		group by a.id, p.id, i.id, r.roleName
	""")
    Optional<IAccountDetail> findDetailById(Long id);
}
