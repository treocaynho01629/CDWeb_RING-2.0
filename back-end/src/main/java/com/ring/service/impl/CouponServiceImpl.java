package com.ring.service.impl;

import com.ring.dto.projection.coupons.ICoupon;
import com.ring.dto.request.CartStateRequest;
import com.ring.dto.request.CouponRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.coupons.CouponDTO;
import com.ring.dto.response.coupons.CouponDetailDTO;
import com.ring.dto.response.coupons.CouponDiscountDTO;
import com.ring.dto.response.dashboard.StatDTO;
import com.ring.exception.EntityOwnershipException;
import com.ring.exception.HttpResponseException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.mapper.CouponMapper;
import com.ring.mapper.DashboardMapper;
import com.ring.model.entity.Account;
import com.ring.model.entity.Coupon;
import com.ring.model.entity.CouponDetail;
import com.ring.model.entity.Shop;
import com.ring.model.enums.CouponType;
import com.ring.model.enums.UserRole;
import com.ring.repository.CouponDetailRepository;
import com.ring.repository.CouponRepository;
import com.ring.repository.ShopRepository;
import com.ring.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepo;
    private final CouponDetailRepository couponDetailRepo;
    private final ShopRepository shopRepo;

    private final CouponMapper couponMapper;
    private final DashboardMapper dashMapper;

    @Cacheable(cacheNames = "coupons")
    public PagingResponse<CouponDTO> getCoupons(Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir,
            List<CouponType> types,
            List<String> codes,
            String code,
            Long shopId,
            Long userId,
            Boolean byShop,
            Boolean showExpired,
            Double cValue,
            Integer cQuantity) {
        Pageable pageable = PageRequest.of(pageNo, pageSize,
                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        // Fetch from database
        Page<ICoupon> couponsList = couponRepo.findCoupons(
                types,
                codes,
                code,
                shopId,
                userId,
                byShop,
                showExpired,
                pageable);

        // Check usable
        if (cValue != null || cQuantity != null) {
            CartStateRequest request = CartStateRequest.builder()
                    .value(cValue)
                    .quantity(cQuantity)
                    .shopId(shopId)
                    .build();
            List<CouponDTO> couponDTOS = couponsList.map((projection) -> {
                Coupon coupon = projection.getCoupon();
                coupon.setIsUsable(this.isUsable(coupon, request));
                return couponMapper.couponToDTO(projection);
            }).toList();
            return new PagingResponse<>(
                    couponDTOS,
                    couponsList.getTotalPages(),
                    couponsList.getTotalElements(),
                    couponsList.getSize(),
                    couponsList.getNumber(),
                    couponsList.isEmpty());
        }

        List<CouponDTO> couponDTOS = couponsList.map(couponMapper::couponToDTO).toList();
        return new PagingResponse<>(
                couponDTOS,
                couponsList.getTotalPages(),
                couponsList.getTotalElements(),
                couponsList.getSize(),
                couponsList.getNumber(),
                couponsList.isEmpty());
    }

    @Cacheable(cacheNames = "couponDetail", key = "#id")
    public CouponDetailDTO getCoupon(Long id) {
        ICoupon coupon = couponRepo.findCouponById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found!",
                        "Không tìm thấy mã giảm giá yêu cầu!"));
        return couponMapper.couponToDetailDTO(coupon);
    }

    @Cacheable(cacheNames = "coupons")
    public CouponDTO getCouponByCode(String code,
            Long shopId,
            Double cValue,
            Integer cQuantity) {
        ICoupon projection = couponRepo.findCouponByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found!",
                        "Không tìm thấy mã giảm giá yêu cầu!"));
        if (cValue != null || cQuantity != null) {
            CartStateRequest request = CartStateRequest.builder()
                    .value(cValue)
                    .quantity(cQuantity)
                    .build();
            Coupon coupon = projection.getCoupon();
            coupon.setIsUsable(this.isUsable(coupon, request));
        }
        return couponMapper.couponToDTO(projection);
    }

    @Cacheable(cacheNames = "coupons")
    public List<CouponDTO> recommendCoupons(List<Long> shopIds) {
        List<ICoupon> couponsList = couponRepo.recommendCoupons(shopIds);
        List<CouponDTO> couponDTOS = couponsList.stream().map(couponMapper::couponToDTO).collect(Collectors.toList());
        return couponDTOS;
    }

    @Cacheable(cacheNames = "coupon")
    public CouponDTO recommendCoupon(Long shopId, CartStateRequest state) {
        ICoupon coupon = couponRepo.recommendCoupon(shopId, state.getValue(), state.getQuantity()).orElse(null);
        if (coupon == null)
            return null;
        return couponMapper.couponToDTO(coupon);
    }

    @Cacheable(cacheNames = "couponAnalytics")
    public StatDTO getAnalytics(Long shopId,
            Long userId,
            Account user) {
        boolean isAdmin = isAuthAdmin();
        return dashMapper.statToDTO(couponRepo.getCouponAnalytics(shopId,
                isAdmin ? userId : user.getId()),
                "coupons",
                "Mã giảm giá");
    }

    @CacheEvict(cacheNames = { "coupons", "couponAnalytics" }, allEntries = true)
    @Transactional
    public Coupon addCoupon(CouponRequest request, Account user) {

        // Create new coupon
        var coupon = Coupon.builder()
                .code(request.getCode())
                .build();

        // Shop validation
        if (request.getShopId() != null) {
            Shop shop = shopRepo.findById(request.getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                            "Không tìm thấy cửa hàng yêu cầu!"));
            if (!isOwnerValid(shop, user))
                throw new EntityOwnershipException("Invalid ownership!",
                        "Người dùng không phải chủ sở hữu của cửa hàng này!");
            coupon.setShop(shop);
        } else {
            if (!isAuthAdmin())
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Shop is required!");
        }
        Coupon addedCoupon = couponRepo.save(coupon); // Save to database

        // Create coupon details
        var couponDetail = CouponDetail.builder()
                .coupon(addedCoupon)
                .type(request.getType())
                .usage(request.getUsage())
                .expDate(request.getExpireDate())
                .attribute(request.getAttribute())
                .discount(request.getDiscount())
                .maxDiscount(request.getMaxDiscount())
                .build();
        CouponDetail addedDetail = couponDetailRepo.save(couponDetail); // Save details to database

        addedCoupon.setDetail(addedDetail);
        return addedCoupon;
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "coupons", "couponAnalytics" }, allEntries = true),
            @CacheEvict(cacheNames = "couponDetail", key = "#id") })
    @Transactional
    public Coupon updateCoupon(Long id, CouponRequest request, Account user) {

        // Get original coupon
        Coupon coupon = couponRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found!",
                        "Không tìm thấy mã giảm giá yêu cầu!"));

        // Check if correct seller or admin
        if (!isOwnerValid(coupon.getShop(), user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không có quyền chỉnh suửa mã giảm giá này!");

        // Shop validation + set
        if (request.getShopId() != null) {
            Shop shop = shopRepo.findById(request.getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop not found!",
                            "Không tìm thấy cửa hàng yêu cầu!"));
            if (!isOwnerValid(shop, user))
                throw new EntityOwnershipException("Invalid ownership!",
                        "Người dùng không phải chủ sở hữu của cửa hàng này!");
            coupon.setShop(shop);
        } else {
            if (!isAuthAdmin())
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Shop is required!");
        }

        // Set new details info
        CouponDetail currDetail = coupon.getDetail();
        currDetail.setType(request.getType());
        currDetail.setUsage(request.getUsage());
        currDetail.setExpDate(request.getExpireDate());
        currDetail.setAttribute(request.getAttribute());
        currDetail.setDiscount(request.getDiscount());
        currDetail.setMaxDiscount(request.getMaxDiscount());
        couponDetailRepo.save(currDetail); // Save new details to database

        coupon.setCode(request.getCode());

        // Update
        Coupon updatedCoupon = couponRepo.save(coupon);
        return updatedCoupon;
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "coupons", "couponAnalytics" }, allEntries = true),
            @CacheEvict(cacheNames = "couponDetail", key = "#id") })
    @Transactional
    public Coupon deleteCoupon(Long id, Account user) {
        Coupon coupon = couponRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found!",
                        "Không tìm thấy mã giảm giá yêu cầu!"));
        // Check if correct seller or admin
        if (!isOwnerValid(coupon.getShop(), user))
            throw new EntityOwnershipException("Invalid ownership!",
                    "Người dùng không có quyền xoá mã giảm giá này!");

        couponRepo.deleteById(id); // Delete from database
        return coupon;
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "coupons", "couponAnalytics" }, allEntries = true) })
    @Transactional
    public void deleteCoupons(List<Long> ids,
            Account user) {
        List<Long> deleteIds = isAuthAdmin() ? ids : couponRepo.findCouponIdsByInIdsAndSeller(ids, user.getId());
        couponRepo.deleteAllById(deleteIds);
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "coupons", "couponAnalytics" }, allEntries = true) })
    @Transactional
    public void deleteCouponsInverse(List<CouponType> types,
            List<String> codes,
            String code,
            Long shopId,
            Long userId,
            Boolean byShop,
            Boolean showExpired,
            List<Long> ids,
            Account user) {
        List<Long> deleteIds = couponRepo.findInverseIds(
                types,
                codes,
                code,
                shopId,
                isAuthAdmin() ? userId : user.getId(),
                byShop,
                showExpired,
                ids);
        couponRepo.deleteAllById(deleteIds);
    }

    @Caching(evict = { @CacheEvict(cacheNames = { "coupons", "couponAnalytics" }, allEntries = true) })
    @Transactional
    public void deleteAllCoupons(Long shopId, Account user) {
        if (isAuthAdmin()) {
            if (shopId != null) {
                couponRepo.deleteAllByShopId(shopId);
            } else {
                couponRepo.deleteAll();
            }
        } else {
            if (shopId != null) {
                couponRepo.deleteAllByShopIdAndShop_Owner(shopId, user);
            } else {
                couponRepo.deleteAllByShop_Owner(user);
            }
        }
    }

    public CouponDiscountDTO applyCoupon(Coupon coupon,
            CartStateRequest request,
            Account user) {
        CouponDetail couponDetail = coupon.getDetail();
        CouponType type = couponDetail.getType();
        BigDecimal discount = couponDetail.getDiscount();

        if (couponRepo.hasUserUsedCoupon(coupon.getId(), user.getId()))
            return null;

        // Current
        double currValue = request.getValue();
        double shippingFee = request.getShippingFee();
        int currQuantity = request.getQuantity();

        // Coupon
        double maxDiscount = couponDetail.getMaxDiscount();
        double attribute = couponDetail.getAttribute();

        // Discount
        double discountValue = 0.0;
        double discountShipping = 0.0;

        // Check conditions & apply
        if (type.equals(CouponType.MIN_AMOUNT)) {
            if (currQuantity >= attribute)
                discountValue = currValue * discount.doubleValue();
        } else if (type.equals(CouponType.MIN_VALUE)) {
            if (currValue >= attribute)
                discountValue = currValue * discount.doubleValue();
        } else if (type.equals(CouponType.SHIPPING)) {
            if (currValue >= attribute)
                discountShipping = shippingFee * discount.doubleValue();
        }

        // If not usable
        if (discountValue == 0.0 && discountShipping == 0.0)
            return null;

        // Threshold
        if (discountValue > maxDiscount)
            discountValue = maxDiscount;
        if (discountShipping > maxDiscount)
            discountShipping = maxDiscount;

        return new CouponDiscountDTO(discountValue, discountShipping);
    }

    public boolean isExpired(Coupon coupon) {
        CouponDetail couponDetail = coupon.getDetail();
        return (couponDetail.getUsage() <= 0 || couponDetail.getExpDate().isBefore(LocalDate.now()));
    }

    protected boolean isUsable(Coupon coupon, CartStateRequest request) {

        boolean result;

        // Check shop
        if (request.getShopId() != null) {
            result = coupon.getShop() != null && Objects.equals(coupon.getShop().getId(), request.getShopId());
        } else {
            result = coupon.getShop() == null;
        }
        if (!result)
            return result;

        CouponDetail couponDetail = coupon.getDetail();
        CouponType type = couponDetail.getType();
        double attribute = couponDetail.getAttribute();

        // Current
        double currValue = request.getValue() != null ? request.getValue() : -1;
        int currQuantity = request.getQuantity() != null ? request.getQuantity() : -1;

        // Check conditions & apply
        if (type.equals(CouponType.MIN_AMOUNT) && currValue > -1) {
            result = currQuantity >= attribute;
        } else if (currValue > -1 &&
                (type.equals(CouponType.MIN_VALUE) || type.equals(CouponType.SHIPPING))) {
            result = currValue >= attribute;
        }

        return result;
    }

    // Check valid role function
    protected boolean isAuthAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); // Get current auth
        return (auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN.toString())));
    }

    protected boolean isOwnerValid(Shop shop, Account user) {
        // Check if is admin or valid owner id
        boolean isAdmin = isAuthAdmin();

        if (shop != null) {
            return shop.getOwner().getId().equals(user.getId()) || isAdmin;
        } else
            return isAdmin;
    }
}
