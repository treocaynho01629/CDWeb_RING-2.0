package com.ring.service.impl;

import com.ring.dto.projection.shops.*;
import com.ring.dto.request.AddressRequest;
import com.ring.dto.request.ShopRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.dashboard.StatDTO;
import com.ring.dto.response.shops.*;
import com.ring.exception.EntityOwnershipException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.mapper.DashboardMapper;
import com.ring.mapper.ShopMapper;
import com.ring.model.entity.Account;
import com.ring.model.entity.Address;
import com.ring.model.entity.Image;
import com.ring.model.entity.Shop;
import com.ring.model.enums.UserRole;
import com.ring.repository.AddressRepository;
import com.ring.repository.ShopRepository;
import com.ring.service.ImageService;
import com.ring.service.ShopService;
import com.ring.utils.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepo;
    private final AddressRepository addressRepo;

    private final ImageService imageService;

    private final ShopMapper shopMapper;
    private final DashboardMapper dashMapper;

    @Cacheable(cacheNames = "shops")
    public PagingResponse<ShopDisplayDTO> getDisplayShops(Integer pageNo,
                                                          Integer pageSize,
                                                          String sortBy,
                                                          String sortDir,
                                                          String keyword,
                                                          Boolean followed,
                                                          Account user) {

        Pageable pageable = PageRequest.of(pageNo, pageSize,
                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
        Long userId = user != null ? user.getId() : null;

        // Fetch from database
        Page<IShopDisplay> shopsList = shopRepo.findShopsDisplay(keyword, followed, userId, pageable);
        List<ShopDisplayDTO> shopDTOS = shopsList.map(shopMapper::displayToDTO).toList();
        return new PagingResponse<>(
                shopDTOS,
                shopsList.getTotalPages(),
                shopsList.getTotalElements(),
                shopsList.getSize(),
                shopsList.getNumber(),
                shopsList.isEmpty());
    }

    @Cacheable(cacheNames = "shops")
    public PagingResponse<ShopDTO> getShops(Integer pageNo,
                                            Integer pageSize,
                                            String sortBy,
                                            String sortDir,
                                            String keyword,
                                            Long userId,
                                            Account user) {

        Pageable pageable = PageRequest.of(pageNo, pageSize,
                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
        boolean isAdmin = isAuthAdmin();

        Page<IShop> shopsList = shopRepo.findShops(keyword,
                userId != null ? isAdmin ? userId : null
                        : isAdmin ? null : user.getId(),
                pageable);
        List<ShopDTO> shopDTOS = shopsList.map(shopMapper::shopToDTO).toList();
        return new PagingResponse<>(
                shopDTOS,
                shopsList.getTotalPages(),
                shopsList.getTotalElements(),
                shopsList.getSize(),
                shopsList.getNumber(),
                shopsList.isEmpty());
    }

    @Cacheable(cacheNames = "shops")
    public List<ShopPreviewDTO> getShopsPreview(Account user) {

        List<IShopPreview> shops = shopRepo.findShopsPreview(user.getId());
        List<ShopPreviewDTO> shopDTOS = shops.stream().map(shopMapper::previewToDTO).collect(Collectors.toList());
        return shopDTOS;
    }

    @Cacheable(cacheNames = "shopInfo")
    public ShopInfoDTO getShopInfo(Long id,
                                   Account user) {

        Long userId = user != null ? user.getId() : null;
        IShopInfo shop = shopRepo.findShopInfoById(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                        "Không tìm thấy cửa hàng yêu cầu!"));
        ShopInfoDTO shopDTO = shopMapper.infoToDTO(shop); // Map to DTO
        return shopDTO;
    }

    @Cacheable(cacheNames = "shop")
    public ShopDisplayDetailDTO getShopDisplayDetail(Long id,
                                                     Account user) {

        Long userId = user != null ? user.getId() : null;
        IShopDisplayDetail shop = shopRepo.findShopDisplayDetailById(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                        "Không tìm thấy cửa hàng yêu cầu!"));
        ShopDisplayDetailDTO shopDTO = shopMapper.displayDetailToDTO(shop); // Map to DTO
        return shopDTO;
    }

    @Cacheable(cacheNames = "shopDetail")
    public ShopDetailDTO getShopDetail(Long id,
                                       Account user) {

        IShopDetail shop = shopRepo.findShopDetailById(id,
                isAuthAdmin() ? null : user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                        "Không tìm thấy cửa hàng yêu cầu!"));
        ShopDetailDTO shopDTO = shopMapper.detailToDTO(shop); // Map to DTO
        return shopDTO;
    }

    @Cacheable(cacheNames = "shopAnalytics")
    public StatDTO getAnalytics(Long userId,
            Account user) {

        boolean isAdmin = isAuthAdmin();
        return dashMapper.statToDTO(shopRepo.getShopAnalytics(isAdmin ? userId : user.getId()),
                "shops",
                "Cửa hàng");
    }

    @CacheEvict(cacheNames = { "shopInfo", "shopDetail", "shop" }, allEntries = true)
    @Transactional
    public void follow(Long id,
            Account user) {

        Shop shop = shopRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                        "Không tìm thấy cửa hàng yêu cầu!"));
        shop.addFollower(user);
        shopRepo.save(shop);
    }

    @CacheEvict(cacheNames = { "shopInfo", "shopDetail", "shop" }, allEntries = true)
    @Transactional
    public void unfollow(Long id,
            Account user) {

        Shop shop = shopRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                        "Không tìm thấy cửa hàng yêu cầu!"));
        shop.removeFollower(user);
        shopRepo.save(shop);
    }

    @CacheEvict(cacheNames = { "shops", "shopsAnalytics" }, allEntries = true)
    @Transactional
    public Shop addShop(ShopRequest request,
            MultipartFile file,
            Account user) {

        // Create address
        AddressRequest addressRequest = request.getAddressRequest();
        var address = Address.builder()
                .name(addressRequest.getName())
                .companyName(addressRequest.getCompanyName())
                .phone(addressRequest.getPhone())
                .city(addressRequest.getCity())
                .address(addressRequest.getAddress())
                .type(addressRequest.getType())
                .build();

        Address savedAddress = addressRepo.save(address); // Save address

        // Create new shop
        var shop = Shop.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(user)
                .address(savedAddress)
                .build();

        // Image upload/replace
        shop = this.changeShopPic(file, request.getImage(), shop);

        Shop addedShop = shopRepo.save(shop); // Save to database
        return addedShop;
    }

    @CacheEvict(cacheNames = { "shopInfo", "shopDetail", "shop", "shops" }, allEntries = true)
    @Transactional
    public Shop updateShop(Long id, ShopRequest request, MultipartFile file, Account user) {

        // Get original shop
        Shop shop = shopRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                        "Không tìm thấy cửa hàng yêu cầu!"));

        // Check if correct seller or admin
        if (!isOwnerValid(shop, user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không có quyền chỉnh sửa cửa hàng này!");

        // Update address
        AddressRequest addressRequest = request.getAddressRequest();
        Address address = shop.getAddress();

        if (address == null)
            address = new Address();

        address.setName(addressRequest.getName());
        address.setCompanyName(addressRequest.getCompanyName());
        address.setPhone(addressRequest.getPhone());
        address.setCity(addressRequest.getCity());
        address.setAddress(addressRequest.getAddress());
        address.setType(addressRequest.getType());

        Address updatedAddress = addressRepo.save(address); // Save address

        shop.setAddress(updatedAddress);
        shop.setName(request.getName());
        shop.setDescription(request.getDescription());

        // Image upload/replace
        shop = this.changeShopPic(file, request.getImage(), shop);

        // Update
        Shop updatedShop = shopRepo.save(shop);
        return updatedShop;
    }

    @CacheEvict(cacheNames = { "shopInfo", "shopDetail", "shop", "shops", "shopsAnalytics" }, allEntries = true)
    public Shop deleteShop(Long id, Account user) {

        Shop shop = shopRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                        "Không tìm thấy cửa hàng yêu cầu!"));
        // Check if correct seller or admin
        if (!isOwnerValid(shop, user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không có quyền xoá cửa hàng này!");

        shopRepo.deleteById(id); // Delete from database
        return shop;
    }

    @CacheEvict(cacheNames = { "shopInfo", "shopDetail", "shop", "shops", "shopsAnalytics" }, allEntries = true)
    @Transactional
    public void deleteShops(List<Long> ids, Account user) {

        List<Long> deleteIds = isAuthAdmin() ? ids : shopRepo.findShopIdsByInIdsAndOwner(ids, user.getId());
        shopRepo.deleteAllById(deleteIds);
    }

    @CacheEvict(cacheNames = { "shopInfo", "shopDetail", "shop", "shops", "shopsAnalytics" }, allEntries = true)
    @Transactional
    public void deleteShopsInverse(String keyword,
            Long userId,
            List<Long> ids,
            Account user) {

        List<Long> deleteIds = shopRepo.findInverseIds(
                keyword,
                isAuthAdmin() ? userId : user.getId(),
                ids);
        shopRepo.deleteAllById(deleteIds);
    }

    @CacheEvict(cacheNames = { "shopInfo", "shopDetail", "shop", "shops", "shopsAnalytics" }, allEntries = true)
    @Override
    public void deleteAllShops(Account user) {

        if (isAuthAdmin()) {
            shopRepo.deleteAll();
        } else {
            shopRepo.deleteAllByOwner(user);
        }
    }

    // Check valid role function
    protected boolean isAuthAdmin() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Get current auth
        return (auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN.toString())));
    }

    // Check valid role function
    protected boolean isOwnerValid(Shop shop, Account user) {

        boolean isAdmin = isAuthAdmin();

        // Check if is admin or valid owner id
        return shop.getOwner().getId().equals(user.getId()) || isAdmin;
    }

    protected Shop changeShopPic(MultipartFile file, String image, Shop shop) {

        if (file != null) { // Contain new image >> upload/replace
            if (shop.getImage() != null)
                imageService.deleteImage(shop.getImage().getId()); // Delete old image
            Image savedImage = imageService.upload(file, FileUploadUtil.SHOP_FOLDER); // Upload new image
            shop.setImage(savedImage); // Set new image
        } else if (image == null) { // Remove image
            if (shop.getImage() != null)
                imageService.deleteImage(shop.getImage().getId()); // Delete old image
            shop.setImage(null);
        }

        return shop;
    }
}
