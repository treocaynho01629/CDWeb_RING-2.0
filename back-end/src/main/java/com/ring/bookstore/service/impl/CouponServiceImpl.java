package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.coupons.CouponDTO;
import com.ring.bookstore.dtos.coupons.CouponDetailDTO;
import com.ring.bookstore.dtos.coupons.CouponDiscountDTO;
import com.ring.bookstore.dtos.coupons.ICoupon;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.dtos.mappers.CouponMapper;
import com.ring.bookstore.dtos.mappers.DashboardMapper;
import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.CouponDetailRepository;
import com.ring.bookstore.repository.CouponRepository;
import com.ring.bookstore.repository.ShopRepository;
import com.ring.bookstore.request.CartStateRequest;
import com.ring.bookstore.request.CouponRequest;
import com.ring.bookstore.service.CouponService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepo;
    private final CouponDetailRepository couponDetailRepo;
    private final ShopRepository shopRepo;

    private final CouponMapper couponMapper;
    private final DashboardMapper dashMapper;

    @Override
    public Page<CouponDTO> getCoupons(Integer pageNo,
                                      Integer pageSize,
                                      String sortBy,
                                      String sortDir,
                                      List<CouponType> types,
                                      List<String> codes,
                                      String code,
                                      Long shopId,
                                      Boolean byShop,
                                      Boolean showExpired,
                                      Double cValue,
                                      Integer cQuantity) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());

        //Fetch from database
        Page<ICoupon> couponsList = couponRepo.findCoupon(
                types,
                codes,
                code,
                shopId,
                byShop,
                showExpired,
                pageable);

        //Check usable
        if (cValue != null || cQuantity != null) {
            CartStateRequest request = CartStateRequest.builder()
                    .value(cValue)
                    .quantity(cQuantity)
                    .build();
            Page<CouponDTO> couponDTOS = couponsList.map((coupon) -> couponMapper.couponToDTO(coupon, request));
            return couponDTOS;
        }

        Page<CouponDTO> couponDTOS = couponsList.map(couponMapper::couponToDTO);
        return couponDTOS;
    }

    public CouponDetailDTO getCoupon(Long id) {
        ICoupon coupon = couponRepo.findCouponById(id).orElseThrow(() ->
                new ResourceNotFoundException("Coupon not found!"));
        return couponMapper.couponToDetailDTO(coupon);
    }

    @Override
    public CouponDTO getCouponByCode(String code, Double cValue, Integer cQuantity) {
        ICoupon coupon = couponRepo.findCouponByCode(code).orElseThrow(() ->
                new ResourceNotFoundException("Coupon not found!"));
        if (cValue != null || cQuantity != null) {
            CartStateRequest request = CartStateRequest.builder()
                    .value(cValue)
                    .quantity(cQuantity)
                    .build();
            return couponMapper.couponToDTO(coupon, request);
        }
        return couponMapper.couponToDTO(coupon);
    }

    public List<CouponDTO> recommendCoupons(List<Long> shopIds) {
        List<ICoupon> couponsList = couponRepo.recommendCoupons(shopIds);
        List<CouponDTO> couponDTOS = couponsList.stream().map(couponMapper::couponToDTO).collect(Collectors.toList()); //Return books
        return couponDTOS;
    }

    @Override
    public CouponDTO recommendCoupon(Long shopId, CartStateRequest state) {
        ICoupon coupon = couponRepo.recommendCoupon(shopId, state.getValue(), state.getQuantity()).orElse(null);
        if (coupon == null) return null;
        return couponMapper.couponToDTO(coupon);
    }

    public StatDTO getAnalytics(Long shopId) {
        return dashMapper.statToDTO(couponRepo.getCouponAnalytics(shopId),
                "coupons",
                "Mã giảm giá");
    }

    //Add coupon (SELLER)
    @Transactional
    public Coupon addCoupon(CouponRequest request, Account user) {
        //Create new coupon
        var coupon = Coupon.builder()
                .code(request.getCode())
                .build();

        //Shop validation
        if (request.getShopId() != null) {
            Shop shop = shopRepo.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFoundException("Shop not found!"));
            if (isOwnerValid(shop, user)) {
                coupon.setShop(shop);
            } else {
                throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");
            }
        } else {
            if (!isAuthAdmin()) {
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Shop is required!");
            }
        }
        Coupon addedCoupon = couponRepo.save(coupon); //Save to database

        //Create coupon details
        var couponDetail = CouponDetail.builder()
                .coupon(addedCoupon)
                .type(request.getType())
                .usage(request.getUsage())
                .expDate(request.getExpireDate())
                .attribute(request.getAttribute())
                .discount(request.getDiscount())
                .maxDiscount(request.getMaxDiscount())
                .build();
        CouponDetail addedDetail = couponDetailRepo.save(couponDetail); //Save details to database

        addedCoupon.setDetail(addedDetail);
        return addedCoupon;
    }

    @Transactional
    public Coupon updateCoupon(Long id, CouponRequest request, Account user) {
        //Get original coupon
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));

        //Check if correct seller or admin
        if (!isOwnerValid(coupon.getShop(), user))
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        //Shop validation + set
        if (request.getShopId() != null) {
            Shop shop = shopRepo.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFoundException("Shop not found!"));
            if (isOwnerValid(shop, user)) {
                coupon.setShop(shop);
            } else {
                throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");
            }
        } else {
            if (!isAuthAdmin()) {
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Shop is required!");
            }
        }

        //Set new details info
        CouponDetail currDetail = coupon.getDetail();
        currDetail.setType(request.getType());
        currDetail.setUsage(request.getUsage());
        currDetail.setExpDate(request.getExpireDate());
        currDetail.setAttribute(request.getAttribute());
        currDetail.setDiscount(request.getDiscount());
        currDetail.setMaxDiscount(request.getMaxDiscount());
        couponDetailRepo.save(currDetail); //Save new details to database

        coupon.setCode(request.getCode());

        //Update
        Coupon updatedCoupon = couponRepo.save(coupon);
        return updatedCoupon;
    }

    @Transactional
    public Coupon deleteCoupon(Long id, Account user) {
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        //Check if correct seller or admin
        if (!isOwnerValid(coupon.getShop(), user))
            throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");

        couponRepo.deleteById(id); //Delete from database
        return coupon;
    }

    @Transactional
    public void deleteCoupons(List<Long> ids,
                              Account user) {
        List<Long> deleteIds = isAuthAdmin() ? ids : couponRepo.findCouponIdsByInIdsAndSeller(ids, user.getId());
        couponRepo.deleteAllById(deleteIds);
    }

    @Override
    public void deleteCouponsInverse(List<CouponType> types,
                                     List<String> codes,
                                     String code,
                                     Long shopId,
                                     Boolean byShop,
                                     Boolean showExpired,
                                     List<Long> ids,
                                     Account user) {
        List<Long> deleteIds = couponRepo.findInverseIds(
                types,
                codes,
                code,
                shopId,
                byShop,
                showExpired,
                isAuthAdmin() ? null : user.getId(),
                ids);
        couponRepo.deleteAllById(deleteIds);
    }

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

        if (couponRepo.hasUserUsedCoupon(coupon.getId(), user.getId())) return null;

        //Current
        double currValue = request.getValue();
        double shippingFee = request.getShippingFee();
        int currQuantity = request.getQuantity();

        //Coupon
        double maxDiscount = couponDetail.getMaxDiscount();
        double attribute = couponDetail.getAttribute();

        //Discount
        double discountValue = 0.0;
        double discountShipping = 0.0;

        //Check conditions & apply
        if (type.equals(CouponType.MIN_AMOUNT)) {
            if (currQuantity >= attribute) discountValue = currValue * discount.doubleValue();
        } else if (type.equals(CouponType.MIN_VALUE)) {
            if (currValue >= attribute) discountValue = currValue * discount.doubleValue();
        } else if (type.equals(CouponType.SHIPPING)) {
            if (currValue >= attribute) discountShipping = shippingFee * discount.doubleValue();
        }

        //If not usable
        if (discountValue == 0.0 && discountShipping == 0.0) return null;

        //Threshold
        if (discountValue > maxDiscount) discountValue = maxDiscount;
        if (discountShipping > maxDiscount) discountShipping = maxDiscount;

        return new CouponDiscountDTO(discountValue, discountShipping);
    }

    public boolean isExpired(Coupon coupon) {
        CouponDetail couponDetail = coupon.getDetail();
        return (couponDetail.getUsage() <= 0 || couponDetail.getExpDate().isBefore(LocalDate.now()));
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
