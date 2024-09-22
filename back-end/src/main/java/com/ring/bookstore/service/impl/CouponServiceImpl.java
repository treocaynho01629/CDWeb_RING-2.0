package com.ring.bookstore.service.impl;

import com.ring.bookstore.enums.CouponType;
import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.*;
import com.ring.bookstore.repository.CouponDetailRepository;
import com.ring.bookstore.repository.CouponRepository;
import com.ring.bookstore.repository.ShopRepository;
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

import java.util.List;

@RequiredArgsConstructor
@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepo;
    private final CouponDetailRepository couponDetailRepo;
    private final ShopRepository shopRepo;

    @Override
    public Page<Coupon> getCoupons(CouponType type, String keyword, Long shopId,
                                   Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ? Sort.by(sortBy).ascending() //Pagination
                : Sort.by(sortBy).descending());

        //Fetch from database
        Page<Coupon> couponsList = couponRepo.findCouponByFilter(type, keyword, shopId, pageable);
        return couponsList;
    }

    @Override
    public Coupon getCouponByCode(String code) {
        Coupon coupon = couponRepo.findByCode(code).orElseThrow(() ->
                new ResourceNotFoundException("Coupon not found!"));
        return coupon;
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
                throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");
            }
        } else {
            if (!isAuthAdmin()) { throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Shop is required!");}
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
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));

        //Check if correct seller or admin
        if (!isOwnerValid(coupon.getShop(), user)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

        //Shop validation + set
        if (request.getShopId() != null) {
            Shop shop = shopRepo.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFoundException("Shop not found!"));
            if (isOwnerValid(shop, user)) {
                coupon.setShop(shop);
            } else {
                throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");
            }
        } else {
            if (!isAuthAdmin()) { throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Shop is required!");}
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

    @Override
    public Coupon deleteCoupon(Long id, Account user) {
        Coupon coupon = couponRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        //Check if correct seller or admin
        if (!isOwnerValid(coupon.getShop(), user)) throw new HttpResponseException(HttpStatus.UNAUTHORIZED, "Invalid role!");

        couponRepo.deleteById(id); //Delete from database
        return coupon;
    }

    @Override
    public void deleteCoupons(List<Long> ids, boolean isInverse) {
//        if (isInverse) {
//            couponRepo.deleteByIdIsNotIn(ids);
//        } else {
//            couponRepo.deleteByIdIsIn(ids);
//        }
    }


    @Override
    public void deleteAllCoupons() {
        couponRepo.deleteAll();
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
