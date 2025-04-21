package com.ring.bookstore.model.mappers;

import java.util.*;
import java.util.stream.Collectors;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.bookstore.model.dto.projection.orders.*;
import com.ring.bookstore.model.dto.response.orders.*;
import com.ring.bookstore.model.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class OrderMapper {

    private final Cloudinary cloudinary;

    // Order/Receipt
    public ReceiptDTO orderToDTO(OrderReceipt order) {
        List<OrderDetail> orderDetails = order.getDetails();
        List<OrderDTO> detailDTOS = orderDetails.stream().map(this::detailToOrderDTO)
                .collect(Collectors.toList());
        Account user = order.getUser();
        Address address = order.getAddress();

        // If user deleted
        String username = user != null ? user.getUsername() : "Người dùng RING!";
        String email = order.getEmail() != null ? order.getEmail() : "Người dùng RING!";

        return new ReceiptDTO(order.getId(),
                email,
                address.getCompanyName() != null ? address.getCompanyName() : address.getName(),
                null,
                address.getPhone(),
                address.getCity() + ", " + address.getAddress(),
                order.getLastModifiedDate(),
                order.getTotal(),
                order.getTotalDiscount(),
                username,
                detailDTOS);
    }

    public List<ReceiptDTO> receiptsAndDetailsProjectionToReceiptDTOS(List<IOrderReceipt> receipts, List<IOrder> details) {
        Map<Long, ReceiptDTO> receiptsMap = new LinkedHashMap<>();

        for (IOrderReceipt receipt : receipts) {

            String url = receipt.getImage() != null
                    ? cloudinary.url().transformation(new Transformation()
                            .aspectRatio("1.0")
                            .width(90)
                            .quality("auto")
                            .fetchFormat("auto"))
                    .secure(true).generate(receipt.getImage().getPublicId())
                    : null;

            // If user deleted
            String username = receipt.getUsername() != null ? receipt.getUsername()
                    : "Người dùng RING!";
            String email = receipt.getEmail() != null ? receipt.getEmail()
                    : "Người dùng RING!";

            ReceiptDTO receiptDTO = ReceiptDTO.builder().id(receipt.getId())
                    .email(email)
                    .name(receipt.getName())
                    .image(url)
                    .phone(receipt.getPhone())
                    .address(receipt.getAddress())
                    .date(receipt.getDate())
                    .total(receipt.getTotal())
                    .totalDiscount(receipt.getTotalDiscount())
                    .username(username)
                    .details(new ArrayList<>())
                    .build();

            receiptsMap.put(receipt.getId(), receiptDTO);
        }

        for (IOrder detail : details) {

            // If shop deleted
            String shopName = detail.getShopName() != null ? detail.getShopName()
                    : "Cửa hàng RING!";
            Long shopId = detail.getShopId() != null ? detail.getShopId() : -1;

            var newDetail = OrderDTO.builder().id(detail.getId())
                    .shopId(shopId)
                    .shopName(shopName)
                    .totalPrice(detail.getTotalPrice())
                    .totalDiscount(detail.getDiscount())
                    .shippingFee(detail.getShippingFee())
                    .shippingDiscount(detail.getShippingDiscount())
                    .totalItems(detail.getTotalItems())
                    .status(detail.getStatus())
                    .note(detail.getNote())
                    .build();

            receiptsMap.get(detail.getOrderId()).details().add(newDetail);
        }

        // Convert & return
        List<ReceiptDTO> result = new ArrayList<ReceiptDTO>(receiptsMap.values());
        return result;
    }

    public OrderDTO detailToOrderDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<OrderItemDTO> itemDTOS = orderItems.stream().map(this::itemToDTO).collect(Collectors.toList());
        Shop shop = detail.getShop();

        // If shop deleted
        String shopName = shop != null ? shop.getName() : "Cửa hàng RING!";
        Long shopId = shop != null ? shop.getId() : -1;

        return new OrderDTO(detail.getId(),
                shopId,
                shopName,
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                detail.getShippingType(),
                detail.getNote(),
                null,
                detail.getStatus(),
                itemDTOS);
    }

    public OrderDetailDTO detailAndItemsProjectionToDetailDTO(IOrderDetail detail, List<IOrderItem> items) {

        // If shop deleted
        String shopName = detail.getShopName() != null ? detail.getShopName() : "Cửa hàng RING!";
        Long shopId = detail.getShopId() != null ? detail.getShopId() : -1;

        OrderDetailDTO result = OrderDetailDTO.builder().orderId(detail.getOrderId())
                .name(detail.getCompanyName() != null ? detail.getCompanyName() : detail.getName())
                .phone(detail.getPhone())
                .address(detail.getCity() + ", " + detail.getAddress())
                .note(detail.getNote())
                .orderedDate(detail.getOrderedDate())
                .date(detail.getDate())
                .id(detail.getId())
                .shopId(shopId)
                .shopName(shopName)
                .totalPrice(detail.getTotalPrice())
                .totalDiscount(detail.getDiscount())
                .shippingType(detail.getShippingType())
                .shippingFee(detail.getShippingFee())
                .shippingDiscount(detail.getShippingDiscount())
                .paymentType(detail.getPaymentType())
                .status(detail.getStatus())
                .items(new ArrayList<>())
                .build();

        System.out.println(items.size());

        for (IOrderItem item : items) {

            String url = item.getImage() != null
                    ? cloudinary.url().transformation(new Transformation()
                            .aspectRatio("1.0")
                            .width(90)
                            .quality("auto")
                            .fetchFormat("auto"))
                    .secure(true).generate(item.getImage().getPublicId())
                    : null;

            // If product deleted
            String bookTitle = item.getTitle() != null ? item.getTitle()
                    : "Cửa hàng RING!";
            Long bookId = item.getBookId() != null ? item.getBookId() : -1;
            String bookSlug = item.getSlug() != null ? item.getSlug() : null;

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
    public List<OrderDTO> ordersAndItemsProjectionToDTOS(List<IOrder> details, List<IOrderItem> items) {
        Map<Long, OrderDTO> ordersMap = new LinkedHashMap<>();

        for (IOrder detail : details) {
            OrderDTO order = OrderDTO.builder()
                    .id(detail.getId())
                    .shopId(detail.getShopId())
                    .shopName(detail.getShopName())
                    .totalPrice(detail.getTotalPrice())
                    .totalDiscount(detail.getDiscount())
                    .shippingFee(detail.getShippingFee())
                    .shippingDiscount(detail.getShippingDiscount())
                    .status(detail.getStatus())
                    .items(new ArrayList<>())
                    .note(detail.getNote())
                    .build();

            ordersMap.put(detail.getId(), order);
        }

        for (IOrderItem item : items) {

            String url = item.getImage() != null
                    ? cloudinary.url().transformation(new Transformation()
                            .aspectRatio("1.0")
                            .width(90)
                            .quality("auto")
                            .fetchFormat("auto"))
                    .secure(true).generate(item.getImage().getPublicId())
                    : null;

            // If product deleted
            String bookTitle = item.getTitle() != null ? item.getTitle()
                    : "Cửa hàng RING!";
            Long bookId = item.getBookId() != null ? item.getBookId() : -1;
            String bookSlug = item.getSlug() != null ? item.getSlug() : null;

            var newItem = OrderItemDTO.builder().id(item.getId())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .discount(item.getDiscount())
                    .bookTitle(bookTitle)
                    .bookId(bookId)
                    .bookSlug(bookSlug)
                    .image(url)
                    .build();

            ordersMap.get(item.getDetailId()).items().add(newItem);
        }

        // Convert & return
        List<OrderDTO> result = new ArrayList<>(ordersMap.values());
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

        // If product deleted
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
        String url = projection.getImage() != null ? cloudinary.url().transformation(new Transformation()
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
                projection.getTotalItems());
    }
}
