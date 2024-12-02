package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.books.BookDTO;
import com.ring.bookstore.dtos.coupons.CouponDTO;
import com.ring.bookstore.dtos.coupons.CouponDiscountDTO;
import com.ring.bookstore.dtos.mappers.CouponMapper;
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
import jakarta.transaction.Transactional;
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

    @Override
    public Page<CouponDTO> getCoupons(Integer pageNo, Integer pageSize, String sortBy, String sortDir,
                                      List<CouponType> types, String keyword, Long shopId, Boolean byShop, Boolean showExpired,
                                      Double cValue, Integer cQuantity) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        //Fetch from database
        Page<Coupon> couponsList = couponRepo.findCouponByFilter(types, keyword, shopId,
                byShop, showExpired, pageable);

        //Check usable
        if (cValue != null || cQuantity != null) {
            CartStateRequest request = CartStateRequest.builder().value(cValue).quantity(cQuantity).build();
            couponsList = couponsList.map(coupon -> markUsable(coupon, request));
        }

        Page<CouponDTO> couponDTOS = couponsList.map(couponMapper::apply);
        return couponDTOS;
    }

    @Override
    public CouponDTO getCouponByCode(String code, Double cValue, Integer cQuantity) {
        Coupon coupon = couponRepo.findCouponByCode(code).orElseThrow(() ->
                new ResourceNotFoundException("Coupon not found!"));
        if (cValue != null || cQuantity != null) {
            CartStateRequest request = CartStateRequest.builder().value(cValue).quantity(cQuantity).build();
            coupon = markUsable(coupon, request);
        }
        return couponMapper.apply(coupon);
    }

    public List<CouponDTO> recommendCoupons(List<Long> shopIds) {
        List<Coupon> couponsList = couponRepo.recommendCoupons(shopIds);
        List<CouponDTO> couponDTOS = couponsList.stream().map(couponMapper::apply).collect(Collectors.toList()); //Return books
        return couponDTOS;
    }

    @Override
    public CouponDTO recommendCoupon(Long shopId, CartStateRequest state) {
        Coupon coupon = couponRepo.recommendCoupon(shopId, state.getValue(), state.getQuantity()).orElse(null);
        if (coupon == null) return null;
        return couponMapper.apply(coupon);
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

        //Create coupon details
        var couponDetail = CouponDetail.builder()
                .type(request.getType())
                .usage(request.getUsage())
                .expDate(request.getExpireDate())
                .attribute(request.getAttribute())
                .discount(request.getDiscount())
                .maxDiscount(request.getMaxDiscount())
                .build();

        Coupon addedCoupon = couponRepo.save(coupon); //Save to database
        CouponDetail addedDetail = couponDetailRepo.save(couponDetail); //Save details to database

        addedCoupon.setDetail(addedDetail);
        return addedCoupon;
    }

    @Transactional
    public Coupon updateCoupon(Long id, CouponRequest request, Account user) {
        //Get original coupon
        Coupon coupon = couponRepo.findCouponById(id).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));

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
    public void deleteCoupons(List<CouponType> types, String keyword, Long shopId, Boolean byShop,
                              Boolean showExpired, List<Long> ids, boolean isInverse, Account user) {
        List<Long> listDelete = ids;
        if (isInverse) listDelete = couponRepo.findInverseIds(types, keyword, shopId, byShop, showExpired, ids);

        //Loop and delete
        for (Long id : listDelete) {
            Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
            //Check if correct seller or admin
            if (!isOwnerValid(coupon.getShop(), user))
                throw new HttpResponseException(HttpStatus.FORBIDDEN, "Invalid role!");
            couponRepo.deleteById(id); //Delete from database
        }
    }

    @Transactional
    public void deleteAllCoupons() {
        couponRepo.deleteAll();
    }

    public CouponDiscountDTO applyCoupon(Coupon coupon, CartStateRequest request) {
        CouponDetail couponDetail = coupon.getDetail();
        CouponType type = couponDetail.getType();
        BigDecimal discount = couponDetail.getDiscount();

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

    public Coupon markUsable(Coupon coupon, CartStateRequest request) {
        CouponDetail couponDetail = coupon.getDetail();
        CouponType type = couponDetail.getType();
        double attribute = couponDetail.getAttribute();

        //Current
        double currValue = request.getValue() != null ? request.getValue() : -1;
        int currQuantity = request.getQuantity() != null ? request.getQuantity() : -1;

        //Check conditions & apply
        if (type.equals(CouponType.MIN_AMOUNT) && currValue > -1) {
            coupon.setIsUsable(currQuantity >= attribute);
        } else if (currValue > -1 &&
                (type.equals(CouponType.MIN_VALUE) || type.equals(CouponType.SHIPPING))) {
            coupon.setIsUsable(currValue >= attribute);
        }

        return coupon;
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
