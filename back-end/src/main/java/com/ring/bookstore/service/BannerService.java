package com.ring.bookstore.service;

import com.ring.bookstore.dtos.banners.BannerDTO;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Banner;
import com.ring.bookstore.request.BannerRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BannerService {

    Page<BannerDTO> getBanners(Integer pageNo,
                               Integer pageSize,
                               String sortBy,
                               String sortDir,
                               String keyword,
                               Long shopId,
                               Boolean byShop);

    Banner addBanner(BannerRequest request,
                     Account user);

    Banner updateBanner(Long id,
                        BannerRequest request,
                        Account user);

    Banner deleteBanner(Long id,
                        Account user);

    void deleteBanners(List<Long> ids,
                       Account user);

    void deleteBannersInverse(String keyword,
                              Long shopId,
                              Boolean byShop,
                              List<Long> ids,
                              Account user);

    void deleteAllBanners(Long shopId,
                          Account user);
}
