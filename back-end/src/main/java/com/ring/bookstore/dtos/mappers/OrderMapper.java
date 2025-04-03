package com.ring.bookstore.dtos.mappers;

import java.util.*;
import java.util.stream.Collectors;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.bookstore.dtos.orders.*;
import com.ring.bookstore.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class OrderMapper {

    private final Cloudinary cloudinary;

    // Order/Receipt
    public ReceiptDTO orderToDTO(OrderReceipt order) {
        List<OrderDetail> orderDetails = order.getDetails();
        List<OrderDTO> detailDTOS = orderDetails.stream().map(this::detailToOrderDTO).collect(Collectors.toList());
        Account user = order.getUser();
        Address address = order.getAddress();

        //If user deleted
        String username = user != null ? user.getUsername() : "Người dùng RING!";

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

    public List<ReceiptDTO> detailsToReceiptDTOS(List<IOrderDetail> details) {
        Map<Long, ReceiptDTO> receiptsMap = new LinkedHashMap<>();

        for (IOrderDetail projectedDetail : details) {
            OrderDetail detail = projectedDetail.getDetail(); //Get detail

            String url = projectedDetail.getImage() != null ?
                    cloudinary.url().transformation(new Transformation()
                                    .aspectRatio("1.0")
                                    .width(90)
                                    .quality("auto")
                                    .fetchFormat("auto"))
                            .secure(true).generate(projectedDetail.getImage().getPublicId())
                    : null;

            //If shop deleted
            String shopName = projectedDetail.getShopName() != null ? projectedDetail.getShopName() : "Cửa hàng RING!";
            Long shopId = detail.getShop() != null ? detail.getShop().getId() : -1;

            var newDetail = OrderDTO.builder().id(detail.getId())
                    .shopId(shopId)
                    .shopName(shopName)
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

                //If user deleted
                String username = projectedDetail.getUsername() != null ? projectedDetail.getUsername() : "Người dùng RING!";

                var newReceipt = ReceiptDTO.builder().id(projectedDetail.getOrderId())
                        .email(projectedDetail.getEmail())
                        .name(projectedDetail.getName())
                        .image(url)
                        .phone(projectedDetail.getPhone())
                        .address(projectedDetail.getAddress())
                        .message(projectedDetail.getMessage())
                        .date(projectedDetail.getDate())
                        .total(projectedDetail.getTotal())
                        .totalDiscount(projectedDetail.getTotalDiscount())
                        .username(username)
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

        //If shop deleted
        String shopName = shop != null ? shop.getName() : "Cửa hàng RING!";
        Long shopId = shop != null ? shop.getId() : -1;

        return new OrderDTO(detail.getId(),
                shopId,
                shopName,
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                null,
                detail.getStatus(),
                itemDTOS);
    }

    public OrderDetailDTO detailItemsToDTO(List<IOrderDetailItem> items) {
        IOrderDetailItem firstItem = items.get(0);
        ArrayList<OrderItemDTO> itemDTOS = new ArrayList<>();

        //If shop deleted
        String shopName = firstItem.getShopName() != null ? firstItem.getShopName() : "Cửa hàng RING!";
        Long shopId = firstItem.getShopId() != null ? firstItem.getShopId() : -1;

        OrderDetailDTO result = new OrderDetailDTO(firstItem.getOrderId(),
                firstItem.getCompanyName() != null ? firstItem.getCompanyName() : firstItem.getName(),
                firstItem.getPhone(),
                firstItem.getCity() + ", " + firstItem.getAddress(),
                firstItem.getMessage(),
                firstItem.getOrderedDate(),
                firstItem.getDate(),
                firstItem.getDetailId(),
                shopId,
                shopName,
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

            String url = projectedItem.getImage() != null ?
                    cloudinary.url().transformation(new Transformation()
                                    .aspectRatio("1.0")
                                    .width(90)
                                    .quality("auto")
                                    .fetchFormat("auto"))
                            .secure(true).generate(projectedItem.getImage().getPublicId())
                    : null;

            //If product deleted
            String bookTitle = projectedItem.getTitle() != null ? projectedItem.getTitle() : "Cửa hàng RING!";
            Long bookId = projectedItem.getBookId() != null ? projectedItem.getBookId() : -1;
            String bookSlug = projectedItem.getSlug() != null ? projectedItem.getSlug() : null;

            var newItem = OrderItemDTO.builder().id(item.getId())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .discount(item.getDiscount())
                    .bookId(bookId)
                    .bookTitle(bookTitle)
                    .bookSlug(bookSlug)
                    .image(url)
                    .build();

            result.items().add(newItem);
        }

        return result;
    }

    // Detail
    public List<OrderDTO> itemsToDetailDTO(List<IOrderItem> items) {
        Map<Long, OrderDTO> ordersMap = new LinkedHashMap<>();

        for (IOrderItem projectedItem : items) {
            OrderItem item = projectedItem.getItem(); //Get Item

            String url = projectedItem.getImage() != null ?
                    cloudinary.url().transformation(new Transformation()
                                    .aspectRatio("1.0")
                                    .width(90)
                                    .quality("auto")
                                    .fetchFormat("auto"))
                            .secure(true).generate(projectedItem.getImage().getPublicId())
                    : null;

            //If product deleted
            String bookTitle = projectedItem.getTitle() != null ? projectedItem.getTitle() : "Cửa hàng RING!";
            Long bookId = projectedItem.getBookId() != null ? projectedItem.getBookId() : -1;
            String bookSlug = projectedItem.getSlug() != null ? projectedItem.getSlug() : null;

            var newItem = OrderItemDTO.builder().id(item.getId())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .discount(item.getDiscount())
                    .bookTitle(bookTitle)
                    .bookId(bookId)
                    .bookSlug(bookSlug)
                    .image(url)
                    .build();

            if (!ordersMap.containsKey(projectedItem.getDetailId())) { //Insert if not exist
                List<OrderItemDTO> itemsList = new ArrayList<>(); //New list
                itemsList.add(newItem);

                //If shop deleted
                String shopName = projectedItem.getShopName() != null ? projectedItem.getShopName() : "Cửa hàng RING!";
                Long shopId = projectedItem.getShopId() != null ? projectedItem.getShopId() : -1;

                var newOrder = OrderDTO.builder().id(projectedItem.getDetailId())
                        .totalPrice(projectedItem.getTotalPrice())
                        .shippingFee(projectedItem.getShippingFee())
                        .totalDiscount(projectedItem.getDiscount())
                        .shippingDiscount(projectedItem.getShippingDiscount())
                        .status(projectedItem.getStatus())
                        .shopId(shopId)
                        .shopName(shopName)
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

    // Item
    public OrderItemDTO itemToDTO(OrderItem item) {
        Book book = item.getBook();
        String url = book != null && book.getImage() != null
                ? cloudinary.url().transformation(new Transformation()
                        .aspectRatio("1.0")
                        .width(90)
                        .quality("auto")
                        .fetchFormat("auto"))
                .secure(true).generate(book.getImage().getPublicId())
                : null;

        //If product deleted
        String bookTitle = book != null ? book.getTitle() : "Cửa hàng RING!";
        Long bookId = book != null ? book.getId() : -1;
        String bookSlug = book != null ? book.getSlug() : null;

        return new OrderItemDTO(item.getId(),
                item.getPrice(),
                item.getDiscount(),
                item.getQuantity(),
                bookId,
                bookSlug,
                url,
                bookTitle);
    }

    // Summary
    public ReceiptSummaryDTO summaryToDTO(IReceiptSummary projection) {
        String url = projection.getImage() != null ?
                cloudinary.url().transformation(new Transformation()
                                .aspectRatio("1.0")
                                .width(55)
                                .crop("thumb")
                                .chain()
                                .radius("max")
                                .quality(50)
                                .fetchFormat("auto"))
                        .secure(true).generate(projection.getImage().getPublicId())
                : null;

        return new ReceiptSummaryDTO(projection.getId(),
                url,
                projection.getName(),
                projection.getDate(),
                projection.getTotalPrice(),
                projection.getTotalItems()
        );
    }
}
