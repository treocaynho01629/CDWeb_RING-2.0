package com.ring.bookstore.service;

import com.ring.bookstore.model.dto.response.dashboard.StatDTO;
import com.ring.bookstore.model.dto.response.shops.*;
import com.ring.bookstore.model.entity.Account;
import com.ring.bookstore.model.entity.Shop;
import com.ring.bookstore.model.dto.request.ShopRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ShopService {

    Page<ShopDisplayDTO> getDisplayShops(Integer pageNo,
                                         Integer pageSize,
                                         String sortBy,
                                         String sortDir,
                                         String keyword,
                                         Boolean followed,
                                         Account user);

    Page<ShopDTO> getShops(Integer pageNo,
                           Integer pageSize,
                           String sortBy,
                           String sortDir,
                           String keyword,
                           Long userId,
                           Account user);

    List<ShopPreviewDTO> getShopsPreview(Account user);

    ShopInfoDTO getShopInfo(Long id,
                            Account user);

    ShopDisplayDetailDTO getShopDisplayDetail(Long id,
                                              Account user);

    ShopDetailDTO getShopDetail(Long id,
                                Account user);

    StatDTO getAnalytics(Long userId,
                         Account user);

    void follow(Long id,
                Account user);

    void unfollow(Long id,
                  Account user);

    Shop addShop(ShopRequest request,
                 MultipartFile file,
                 Account user);

    Shop updateShop(Long id,
                    ShopRequest request,
                    MultipartFile file,
                    Account user);

    Shop deleteShop(Long id,
                    Account user);

    void deleteShops(List<Long> ids,
                     Account user);

    void deleteShopsInverse(String keyword,
                            Long userId,
                            List<Long> ids,
                            Account user);

    void deleteAllShops(Account user);
}
