package com.ring.bookstore.service;

import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.dtos.shops.ShopDTO;
import com.ring.bookstore.dtos.shops.ShopDetailDTO;
import com.ring.bookstore.dtos.shops.ShopDisplayDTO;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Shop;
import com.ring.bookstore.request.ShopRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ShopService {

    Page<ShopDisplayDTO> getDisplayShops(Integer pageNo,
                                         Integer pageSize,
                                         String sortBy,
                                         String sortDir,
                                         String keyword);

    Page<ShopDTO> getShops(Integer pageNo,
                           Integer pageSize,
                           String sortBy,
                           String sortDir,
                           String keyword,
                           Long userId,
                           Account user);

    ShopDetailDTO getShopById(Long id,
                              Account user);

    StatDTO getAnalytics();

    void follow(Long id,
                Account user);

    void unfollow(Long id,
                  Account user);

    Shop addShop(ShopRequest request,
                 MultipartFile file,
                 Account user) throws IOException, ImageResizerException;

    Shop updateShop(Long id,
                    ShopRequest request,
                    MultipartFile file,
                    Account user) throws IOException, ImageResizerException;

    Shop deleteShop(Long id,
                    Account user);

    void deleteShops(String keyword,
                     Long ownerId,
                     List<Long> ids,
                     Boolean isInverse,
                     Account user);

    void deleteAllShops();
}
