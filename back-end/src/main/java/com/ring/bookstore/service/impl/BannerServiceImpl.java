package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.banners.BannerDTO;
import com.ring.bookstore.dtos.mappers.BannerMapper;
import com.ring.bookstore.dtos.banners.IBanner;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Banner;
import com.ring.bookstore.model.Shop;
import com.ring.bookstore.repository.BannerRepository;
import com.ring.bookstore.request.BannerRequest;
import com.ring.bookstore.service.BannerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepo;
    private final BannerMapper bannerMapper;

    @Override
    public Page<BannerDTO> getBanners(Integer pageNo, Integer pageSize, String sortBy, String sortDir,
                                   String keyword, Long shopId, Boolean byShop) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        //Fetch from database
        Page<IBanner> bannersList = bannerRepo.findBanner(keyword, shopId, byShop, pageable);
        Page<BannerDTO> bannerDTOS = bannersList.map(bannerMapper::apply);
        return bannerDTOS;
    }

    //Add banner (SELLER)
    @Transactional
    public Banner addBanner(BannerRequest request, Account user) {
        return null;
    }

    @Transactional
    public Banner updateBanner(Long id, BannerRequest request, Account user) {
        return null;
    }

    @Override
    public Banner deleteBanner(Long id, Account user) {
        return null;
    }

    @Override
    public void deleteBanners(String keyword, Long shopId, Boolean byShop,
                              List<Long> ids, boolean isInverse, Account user) {
    }

    @Override
    public void deleteAllBanners() {
    }

    //Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //Get current auth
        return (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_ADMIN.toString())));
    }

    protected boolean isOwnerValid(Shop shop, Account user) {
        //Check if is admin or valid owner id
        boolean isAdmin = isAuthAdmin();

        if (shop != null) {
            return shop.getOwner().getId().equals(user.getId()) || isAdmin;
        } else return isAdmin;
    }
}
