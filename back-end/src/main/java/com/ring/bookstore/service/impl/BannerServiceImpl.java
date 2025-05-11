package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.EntityOwnershipException;
import com.ring.bookstore.model.dto.response.PagingResponse;
import com.ring.bookstore.model.dto.response.banners.BannerDTO;
import com.ring.bookstore.model.entity.*;
import com.ring.bookstore.model.mappers.BannerMapper;
import com.ring.bookstore.model.dto.projection.banners.IBanner;
import com.ring.bookstore.model.enums.UserRole;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.repository.BannerRepository;
import com.ring.bookstore.model.dto.request.BannerRequest;
import com.ring.bookstore.repository.ShopRepository;
import com.ring.bookstore.service.BannerService;
import com.ring.bookstore.service.ImageService;
import com.ring.bookstore.ultils.FileUploadUtil;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepo;
    private final ShopRepository shopRepo;

    private final ImageService imageService;

    private final BannerMapper bannerMapper;

    @Cacheable(cacheNames = "banners")
    public PagingResponse<BannerDTO> getBanners(Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir,
            String keyword,
            Long shopId,
            Boolean byShop) {
        Pageable pageable = PageRequest.of(pageNo, pageSize,
                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        // Fetch from database
        Page<IBanner> bannersList = bannerRepo.findBanners(keyword, shopId, byShop, pageable);
        List<BannerDTO> bannerDTOS = bannersList.map(bannerMapper::apply).toList();
        return new PagingResponse<>(bannerDTOS,
                bannersList.getTotalPages(),
                bannersList.getTotalElements(),
                bannersList.getSize(),
                bannersList.getNumber(),
                bannersList.isEmpty());
    }

    @CacheEvict(cacheNames = "banners", allEntries = true)
    @Transactional
    public Banner addBanner(BannerRequest request,
            MultipartFile file,
            Account user) {

        // Create new banner
        var banner = Banner.builder()
                .name(request.getName())
                .description(request.getDescription())
                .url(request.getUrl())
                .build();

        // Shop validation
        if (request.getShopId() != null) {
            Shop shop = shopRepo.findById(request.getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                            "Không tìm thấy cửa hàng yêu cầu!"));
            if (!isOwnerValid(shop, user))
                throw new EntityOwnershipException("Invalid ownership!",
                        "Người dùng không sở hữu của hàng này!");
            banner.setShop(shop);
        } else {
            if (!isAuthAdmin())
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Shop is required!");
        }

        // Image upload
        banner = this.changeBannerPic(file, banner);

        Banner addedBanner = bannerRepo.save(banner); // Save to database
        return addedBanner;
    }

    @Caching(evict = { @CacheEvict(cacheNames = "banners", allEntries = true),
            @CacheEvict(cacheNames = "bannerDetail", key = "#id") })

    @Transactional
    public Banner updateBanner(Integer id,
            BannerRequest request,
            MultipartFile file,
            Account user) {

        // Get original banner
        Banner banner = bannerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found!",
                        "Không tìm thấy sự kiện yêu cầu!"));

        // Check if correct seller or admin
        if (!isOwnerValid(banner.getShop(), user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không có quyền chỉnh sửa sự kiện này!");

        // Shop validation + set
        if (request.getShopId() != null) {
            Shop shop = shopRepo.findById(request.getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                            "Không tìm thấy cửa hàng yêu cầu!"));
            if (!isOwnerValid(shop, user))
                throw new EntityOwnershipException("Invalid ownership!",
                        "Người dùng không sở hữu cửa hàng này!");
            banner.setShop(shop);
        } else {
            if (!isAuthAdmin())
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Shop is required!");
        }

        // Set new info
        banner.setName(request.getName());
        banner.setDescription(request.getDescription());
        banner.setUrl(request.getUrl());

        // Replace image
        banner = this.changeBannerPic(file, banner);

        // Update
        Banner updatedBanner = bannerRepo.save(banner);
        return updatedBanner;
    }

    @Caching(evict = { @CacheEvict(cacheNames = "banners", allEntries = true),
            @CacheEvict(cacheNames = "bannerDetail", key = "#id") })
    @Transactional
    public Banner deleteBanner(Integer id,
            Account user) {
        Banner banner = bannerRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found",
                        "Không tìm thấy sự kiện yêu cầu!"));
        // Check if correct seller or admin
        if (!isOwnerValid(banner.getShop(), user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không có quyền xoá sự kiện này!");

        bannerRepo.deleteById(id); // Delete from database
        return banner;
    }

    @Caching(evict = { @CacheEvict(cacheNames = "banners", allEntries = true) })
    @Transactional
    public void deleteBanners(List<Integer> ids,
            Account user) {
        List<Integer> deleteIds = isAuthAdmin() ? ids : bannerRepo.findBannerIdsByInIdsAndOwner(ids, user.getId());
        bannerRepo.deleteAllById(deleteIds);
    }

    @Caching(evict = { @CacheEvict(cacheNames = "banners", allEntries = true) })
    @Transactional
    public void deleteBannersInverse(String keyword,
            Long shopId,
            Boolean byShop,
            List<Integer> ids,
            Account user) {
        List<Integer> deleteIds = bannerRepo.findInverseIds(
                keyword,
                shopId,
                byShop,
                isAuthAdmin() ? null : user.getId(),
                ids);
        bannerRepo.deleteAllById(deleteIds);
    }

    @Caching(evict = { @CacheEvict(cacheNames = "banners", allEntries = true) })
    @Transactional
    public void deleteAllBanners(Long shopId,
            Account user) {
        if (isAuthAdmin()) {
            if (shopId != null) {
                bannerRepo.deleteAllByShopId(shopId);
            } else {
                bannerRepo.deleteAll();
            }
        } else {
            if (shopId != null) {
                bannerRepo.deleteAllByShopIdAndShop_Owner(shopId, user);
            } else {
                bannerRepo.deleteAllByShop_Owner(user);
            }
        }
    }

    // Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Get current auth
        return (auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN.toString())));
    }

    protected boolean isOwnerValid(Shop shop,
            Account user) {
        // Check if is admin or valid owner id
        boolean isAdmin = isAuthAdmin();

        if (shop != null) {
            return shop.getOwner().getId().equals(user.getId()) || isAdmin;
        } else
            return isAdmin;
    }

    protected Banner changeBannerPic(MultipartFile file, Banner banner) {
        if (file != null) {
            if (banner.getImage() != null)
                imageService.deleteImage(banner.getImage().getId()); // Delete old image
            Image savedImage = imageService.upload(file, FileUploadUtil.BANNER_FOLDER); // Upload new image
            banner.setImage(savedImage); // Set new image
        }

        return banner;
    }
}
