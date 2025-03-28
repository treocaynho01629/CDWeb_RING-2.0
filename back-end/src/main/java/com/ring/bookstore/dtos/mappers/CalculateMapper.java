package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.orders.CalculateDTO;
import com.ring.bookstore.dtos.orders.CalculateDetailDTO;
import com.ring.bookstore.dtos.orders.CalculateItemDTO;
import com.ring.bookstore.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CalculateMapper {
    private final CouponMapper couponMapper;

    public CalculateDetailDTO detailToDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<CalculateItemDTO> itemDTOS = orderItems.stream().map(this::itemToDTO).collect(Collectors.toList());

        //Shop
        Shop shop = detail.getShop();
        String shopName = (shopName = shop.getName()) != null ? shopName : null;

        return new CalculateDetailDTO(shop.getId(),
                shopName,
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getCouponDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                detail.getCouponDTO() != null ? detail.getCouponDTO() : null,
                itemDTOS);
    }

    public CalculateItemDTO itemToDTO(OrderItem item) {
        Book book = item.getBook();
        double price = (price = book.getPrice()) != 0.0 ? price : -1.0;
        short amount = book.getAmount();
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

    public CalculateDTO orderToDTO(OrderReceipt order) {
        List<OrderDetail> orderDetails = order.getDetails();
        List<CalculateDetailDTO> detailDTOS = orderDetails.stream().map(this::detailToDTO).collect(Collectors.toList());

        return new CalculateDTO(order.getTotal(),
                order.getProductsPrice(),
                order.getShippingFee(),
                order.getTotalDiscount(),
                order.getDealDiscount(),
                order.getCouponDiscount(),
                order.getShippingDiscount(),
                order.getCouponDTO() != null ? order.getCouponDTO() : null,
                detailDTOS
        );
    }
}
