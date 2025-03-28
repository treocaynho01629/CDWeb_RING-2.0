package com.ring.bookstore.controller;

import com.ring.bookstore.dtos.orders.*;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.request.CalculateRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.config.CurrentAccount;
import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.OrderRequest;
import com.ring.bookstore.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    //Calculate price
    @PostMapping("/calculate")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CalculateDTO> calculate(@RequestBody @Valid CalculateRequest request,
                                                  @CurrentAccount Account currUser) {
        CalculateDTO calculateResult = orderService.calculate(request, currUser);
        return new ResponseEntity<>(calculateResult, HttpStatus.CREATED);
    }

    //Commit order
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReceiptDTO> checkout(@RequestBody @Valid OrderRequest checkRequest,
                                               HttpServletRequest request,
                                               @CurrentAccount Account currUser) {
        ReceiptDTO result = orderService.checkout(checkRequest, request, currUser);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    //Get summaries
    @GetMapping("/summaries")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getSummaries(@RequestParam(value = "shopId", required = false) Long shopId,
                                          @RequestParam(value = "bookId", required = false) Long bookId,
                                          @RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
                                          @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                          @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                          @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
                                          @CurrentAccount Account currUser) {
        Page<ReceiptSummaryDTO> summaries = orderService.getSummariesWithFilter(currUser, shopId, bookId, pageNo, pageSize, sortBy, sortDir);
        return new ResponseEntity<>(summaries, HttpStatus.OK);
    }

    //Get all
    @GetMapping("/receipts")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getAllReceipts(@RequestParam(value = "shopId", required = false) Long shopId,
                                            @RequestParam(value = "status", defaultValue = "") OrderStatus status,
                                            @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                            @RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
                                            @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
                                            @CurrentAccount Account currUser) {
        Page<ReceiptDTO> orders = orderService.getAllReceipts(currUser, shopId, status, keyword, pageNo, pageSize, sortBy, sortDir);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    //Get order by {id}
    @GetMapping("/receipts/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getReceipt(@PathVariable("id") Long id) {
        ReceiptDTO receipt = orderService.getReceipt(id);
        return new ResponseEntity<>(receipt, HttpStatus.OK);
    }

    //Get order by {id}
    @GetMapping("/detail/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getOrderDetail(@PathVariable("id") Long id,
                                            @CurrentAccount Account currUser) {
        OrderDetailDTO order = orderService.getOrderDetail(id, currUser);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    //Get orders from user
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getOrdersByUser(@RequestParam(value = "status", defaultValue = "") OrderStatus status,
                                             @RequestParam(value = "keyword", defaultValue = "") String keyword,
                                             @RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
                                             @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                             @CurrentAccount Account currUser) {
        Page<OrderDTO> orders = orderService.getOrdersByUser(currUser, status, keyword, pageNo, pageSize);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    //Get orders for book's {id}
    @GetMapping("/book/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getOrdersByBookId(@PathVariable("id") Long id,
                                               @RequestParam(value = "pSize", defaultValue = "15") Integer pageSize,
                                               @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                               @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                               @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
        Page<OrderDTO> orders = orderService.getOrdersByBookId(id, pageNo, pageSize, sortBy, sortDir);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    //Cancel
    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> cancelOrder(@PathVariable("id") Long id,
                                         @RequestParam(value = "reason")
                                         @NotBlank(message = "Lý do không được bỏ trống!")
                                         @Size(max = 300, message = "Lý do không quá quá 300 kí tự!") String reason,
                                         @CurrentAccount Account currUser) {
        orderService.cancel(id, reason, currUser);
        return new ResponseEntity<>("Order canceled successfully!", HttpStatus.CREATED);
    }

    //Refund
    @PutMapping("/refund/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> refundOrder(@PathVariable("id") Long id,
                                         @RequestParam(value = "reason")
                                         @NotBlank(message = "Lý do không được bỏ trống!")
                                         @Size(max = 300, message = "Lý do không quá quá 300 kí tự!") String reason,
                                         @CurrentAccount Account currUser) {
        orderService.refund(id, reason, currUser);
        return new ResponseEntity<>("Order refunded successfully!", HttpStatus.CREATED);
    }

    //Confirm
    @PutMapping("/confirm/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> confirmOrder(@PathVariable("id") Long id,
                                          @CurrentAccount Account currUser) {
        orderService.confirm(id, currUser);
        return new ResponseEntity<>("Order confirmed successfully!", HttpStatus.CREATED);
    }

    //Update order status
    @PutMapping("/status/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> changeOrderStatus(@PathVariable("id") Long id,
                                               @RequestParam(value = "status", defaultValue = "COMPLETED") OrderStatus status,
                                               @CurrentAccount Account currUser) {
        orderService.changeStatus(id, status, currUser);
        return new ResponseEntity<>("Order status changed successfully!", HttpStatus.CREATED);
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getUserAnalytics(@RequestParam(value = "shopId", required = false) Long shopId,
                                              @CurrentAccount Account currUser) {
        return new ResponseEntity<>(orderService.getAnalytics(currUser, shopId), HttpStatus.OK);
    }

    //Get orders chart
    @GetMapping("/sales")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER','GUEST') and hasAuthority('READ_PRIVILEGE')")
    public ResponseEntity<?> getMonthlySales(@RequestParam(value = "shopId", required = false) Long shopId,
                                             @RequestParam(value = "year", required = false) Integer year,
                                             @CurrentAccount Account currUser) {
        return new ResponseEntity<>(orderService.getMonthlySales(currUser, shopId, year), HttpStatus.OK);
    }
}
