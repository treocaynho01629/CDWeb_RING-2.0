package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.orders.CalculateDTO;
import com.ring.bookstore.dtos.orders.CalculateDetailDTO;
import com.ring.bookstore.dtos.orders.CalculateItemDTO;
import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalculateMapper {
    public CalculateDetailDTO detailToDetailDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<CalculateItemDTO> itemDTOS = orderItems.stream().map(this::itemToItemDTO).collect(Collectors.toList());

        //Shop
        Shop shop = detail.getShop();
        String shopName = (shopName = shop.getName()) != null ? shopName : null;

        //Coupon
        String coupon = detail.getCoupon() != null ? detail.getCoupon().getCode() : null;

        return new CalculateDetailDTO(shop.getId(),
                shopName,
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getCouponDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                coupon,
                itemDTOS);
    }

    public CalculateItemDTO itemToItemDTO(OrderItem item) {
        Book book = item.getBook();
        double price = (price = book.getPrice()) != 0.0 ? price : -1.0;
        short amount = (amount = book.getAmount()) != 0 ? amount : 0;
        BigDecimal discount = (discount = book.getDiscount()) != null ? discount : null;
        String title = (title = book.getTitle()) != null ? title : null;
        String slug = (slug = book.getSlug()) != null ? slug : null;

        return new CalculateItemDTO(price,
                discount,
                amount,
                item.getQuantity(),
                book.getId(),
                slug,
                title);
    }

    public CalculateDTO orderToCalculate(OrderReceipt order) {
        List<OrderDetail> orderDetails = order.getDetails();
        List<CalculateDetailDTO> detailDTOS = orderDetails.stream().map(this::detailToDetailDTO).collect(Collectors.toList());

        //Coupon
        String coupon = order.getCoupon() != null ? order.getCoupon().getCode() : null;

        return new CalculateDTO(order.getTotal(),
                order.getProductsPrice(),
                order.getShippingFee(),
                order.getTotalDiscount(),
                order.getDealDiscount(),
                order.getCouponDiscount(),
                order.getShippingDiscount(),
                coupon,
                detailDTOS
        );
    }
}
