package com.ring.bookstore.service;

import com.ring.bookstore.dtos.ShopDTO;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.model.Shop;
import com.ring.bookstore.request.ShopRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ShopService {

    Page<ShopDTO> getShops(Integer pageNo, Integer pageSize, String sortBy, String sortDir, String keyword, Long ownerId);

    ShopDTO getShopById(Long id);

    Shop addShop(ShopRequest request, MultipartFile file, Account user) throws IOException, ImageResizerException;

    Shop updateShop(Long id, ShopRequest request, MultipartFile file, Account user) throws IOException, ImageResizerException;

    Shop deleteShop(Long id, Account user);

    void deleteShops(String keyword, Long ownerId, List<Long> ids, boolean isInverse, Account user);

    void deleteAllShops();
}
