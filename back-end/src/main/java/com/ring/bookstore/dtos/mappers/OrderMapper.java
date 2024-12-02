package com.ring.bookstore.dtos.mappers;

import java.util.*;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.orders.*;
import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class OrderMapper {

    public ReceiptDTO orderToOrderDTO(OrderReceipt order) {
        List<OrderDetail> orderDetails = order.getDetails();
        List<OrderDTO> detailDTOS = orderDetails.stream().map(this::detailToDetailDTO).collect(Collectors.toList());
        Account user = order.getUser();
        Address address = order.getAddress();

        //If user deleted
        String username = "Người dùng RING!";
        if (user != null) username = user.getUsername();

        return new ReceiptDTO(order.getId(),
                order.getEmail(),
                address.getCompanyName() != null ? address.getCompanyName() : address.getName(),
                address.getPhone(),
                address.getCity() + ", " + address.getAddress(),
                order.getOrderMessage(),
                order.getLastModifiedDate(),
                order.getTotal(),
                order.getTotalDiscount(),
                username,
                detailDTOS
        );
    }

    public List<OrderDTO> itemsToDetailDTO(List<IOrderItem> items) {
        Map<Long, OrderDTO> ordersMap = new LinkedHashMap<>();

        for (IOrderItem projectedItem : items) {
            OrderItem item = projectedItem.getItem(); //Get Item

            String fileDownloadUri = projectedItem.getImage() != null ?
                    ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/images/")
                            .path(projectedItem.getImage())
                            .toUriString()
                    : null;

            var newItem = OrderItemDTO.builder().id(item.getId())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .discount(item.getDiscount())
                    .bookId(projectedItem.getBookId())
                    .bookTitle(projectedItem.getTitle())
                    .bookSlug(projectedItem.getSlug())
                    .image(fileDownloadUri)
                    .build();

            if (!ordersMap.containsKey(projectedItem.getDetailId())) { //Insert if not exist
                List<OrderItemDTO> itemsList = new ArrayList<>(); //New list
                itemsList.add(newItem);

                var newOrder = OrderDTO.builder().id(projectedItem.getDetailId())
                        .totalPrice(projectedItem.getTotalPrice())
                        .shippingFee(projectedItem.getShippingFee())
                        .totalDiscount(projectedItem.getDiscount())
                        .shippingDiscount(projectedItem.getShippingDiscount())
                        .status(projectedItem.getStatus())
                        .shopId(projectedItem.getShopId())
                        .shopName(projectedItem.getShopName())
                        .items(itemsList)
                        .build();
                ordersMap.put(projectedItem.getDetailId(), newOrder);
            } else { //Add to existing list
                ordersMap.get(projectedItem.getDetailId()).items().add(newItem);
            }
        }

        //Convert & return
        List<OrderDTO> result = new ArrayList<OrderDTO>(ordersMap.values());
        return result;
    }

    public OrderDTO detailToDetailDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<OrderItemDTO> itemDTOS = orderItems.stream().map(this::itemToItemDTO).collect(Collectors.toList());
        Shop shop = detail.getShop();

        return new OrderDTO(detail.getId(),
                shop.getId(),
                shop.getName(),
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                detail.getStatus(),
                itemDTOS);
    }

    public OrderItemDTO itemToItemDTO(OrderItem item) {
        Book book = item.getBook();
        String fileDownloadUri = book.getImage().getFileDownloadUri();

        return new OrderItemDTO(item.getId(),
                item.getPrice(),
                item.getDiscount(),
                item.getQuantity(),
                book.getId(),
                book.getSlug(),
                fileDownloadUri,
                book.getTitle());
    }

    public OrderDetailDTO orderToDetailDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<OrderItemDTO> itemDTOS = orderItems.stream().map(this::itemToItemDTO).collect(Collectors.toList());
        OrderReceipt order = detail.getOrder();
        Address address = order.getAddress();
        Shop shop = detail.getShop();

        return new OrderDetailDTO(order.getId(),
                order.getEmail(),
                address.getCompanyName() != null ? address.getCompanyName() : address.getName(),
                address.getPhone(),
                address.getCity() + ", " + address.getAddress(),
                order.getOrderMessage(),
                order.getLastModifiedDate(),
                detail.getId(),
                shop.getId(),
                shop.getName(),
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                itemDTOS);
    }
}
