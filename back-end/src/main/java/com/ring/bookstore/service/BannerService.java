package com.ring.bookstore.service;

import com.ring.bookstore.model.dto.request.BannerRequest;
import com.ring.bookstore.model.dto.response.banners.BannerDTO;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Banner;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BannerService {

    Page<BannerDTO> getBanners(Integer pageNo,
                               Integer pageSize,
                               String sortBy,
                               String sortDir,
                               String keyword,
                               Long shopId,
                               Boolean byShop);

    Banner addBanner(BannerRequest request,
                     MultipartFile file,
                     Account user);

    Banner updateBanner(Integer id,
                        BannerRequest request,
                        MultipartFile file,
                        Account user);

    Banner deleteBanner(Integer id,
                        Account user);

    void deleteBanners(List<Integer> ids,
                       Account user);

    void deleteBannersInverse(String keyword,
                              Long shopId,
                              Boolean byShop,
                              List<Integer> ids,
                              Account user);

    void deleteAllBanners(Long shopId,
                          Account user);
}
