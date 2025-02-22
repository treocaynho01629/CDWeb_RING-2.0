package com.ring.bookstore.dtos.mappers;

import java.util.*;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.orders.*;
import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class OrderMapper {

    public ReceiptDTO orderToDTO(OrderReceipt order) {
        List<OrderDetail> orderDetails = order.getDetails();
        List<OrderDTO> detailDTOS = orderDetails.stream().map(this::detailToOrderDTO).collect(Collectors.toList());
        Account user = order.getUser();
        Address address = order.getAddress();

        //If user deleted
        String username = "Người dùng RING!";
        if (user != null) username = user.getUsername();

        return new ReceiptDTO(order.getId(),
                order.getEmail(),
                address.getCompanyName() != null ? address.getCompanyName() : address.getName(),
                null,
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

    public List<ReceiptDTO> detailsToReceiptDTO(List<IOrderDetail> details) {
        Map<Long, ReceiptDTO> receiptsMap = new LinkedHashMap<>();

        for (IOrderDetail projectedDetail : details) {
            OrderDetail detail = projectedDetail.getDetail(); //Get detail

            String fileDownloadUri = projectedDetail.getImage() != null ?
                    ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/images/")
                            .path(projectedDetail.getImage())
                            .toUriString()
                    : null;

            var newDetail = OrderDTO.builder().id(detail.getId())
                    .shopId(detail.getShop().getId())
                    .shopName(projectedDetail.getShopName())
                    .totalPrice(detail.getTotalPrice())
                    .totalDiscount(detail.getDiscount())
                    .shippingFee(detail.getShippingFee())
                    .shippingDiscount(detail.getShippingDiscount())
                    .totalItems(projectedDetail.getTotalItems())
                    .status(detail.getStatus())
                    .build();

            if (!receiptsMap.containsKey(projectedDetail.getOrderId())) { //Insert if not exist
                List<OrderDTO> detailsList = new ArrayList<>(); //New list
                detailsList.add(newDetail);

                var newReceipt = ReceiptDTO.builder().id(projectedDetail.getOrderId())
                        .email(projectedDetail.getEmail())
                        .name(projectedDetail.getName())
                        .image(fileDownloadUri)
                        .phone(projectedDetail.getPhone())
                        .address(projectedDetail.getAddress())
                        .message(projectedDetail.getMessage())
                        .date(projectedDetail.getDate())
                        .total(projectedDetail.getTotal())
                        .totalDiscount(projectedDetail.getTotalDiscount())
                        .username(projectedDetail.getUsername())
                        .details(detailsList)
                        .build();
                receiptsMap.put(projectedDetail.getOrderId(), newReceipt);
            } else { //Add to existing list
                receiptsMap.get(projectedDetail.getOrderId()).details().add(newDetail);
            }
        }

        //Convert & return
        List<ReceiptDTO> result = new ArrayList<ReceiptDTO>(receiptsMap.values());
        return result;
    }

    public OrderDTO detailToOrderDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<OrderItemDTO> itemDTOS = orderItems.stream().map(this::itemToDTO).collect(Collectors.toList());
        Shop shop = detail.getShop();

        return new OrderDTO(detail.getId(),
                shop.getId(),
                shop.getName(),
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                null,
                detail.getStatus(),
                itemDTOS);
    }

    public OrderItemDTO itemToDTO(OrderItem item) {
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

    public OrderDetailDTO detailItemsToDTO(List<IOrderDetailItem> items) {
        IOrderDetailItem firstItem = items.get(0);
        ArrayList<OrderItemDTO> itemDTOS = new ArrayList<>();
        OrderDetailDTO result = new OrderDetailDTO(firstItem.getOrderId(),
                firstItem.getCompanyName() != null ? firstItem.getCompanyName() : firstItem.getName(),
                firstItem.getPhone(),
                firstItem.getCity() + ", " + firstItem.getAddress(),
                firstItem.getMessage(),
                firstItem.getOrderedDate(),
                firstItem.getDate(),
                firstItem.getDetailId(),
                firstItem.getShopId(),
                firstItem.getShopName(),
                firstItem.getTotalPrice(),
                firstItem.getDiscount(),
                firstItem.getShippingFee(),
                firstItem.getShippingDiscount(),
                firstItem.getShippingType(),
                firstItem.getPaymentType(),
                firstItem.getStatus(),
                itemDTOS);

        for (IOrderDetailItem projectedItem : items) {
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

            result.items().add(newItem);
        }

        return result;
    }

    public ReceiptSummaryDTO summaryToDTO(IReceiptSummary projection) {
        return new ReceiptSummaryDTO(projection.getId(),
                projection.getImage(),
                projection.getName(),
                projection.getDate(),
                projection.getTotalPrice(),
                projection.getTotalItems()
        );
    }
}
