package com.ring.controller;

import com.ring.dto.request.ConfirmWebhookRequest;
import com.ring.model.entity.PaymentInfo;
import com.ring.service.OrderService;
import com.ring.service.PayOSService;
import com.ring.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.PaymentLinkData;
import vn.payos.type.Webhook;

/**
 * Controller named {@link PaymentController} for handling payments-related
 * operations.
 * Exposes endpoints under "/api/payments".
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;
    private final PayOSService payOSService;
    private final PaymentService paymentService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('read:order')")
    public ResponseEntity<?> getPaymentLink(@PathVariable("id") Long id) {

        PaymentLinkData payment = orderService.getPaymentLinkData(id);
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('update:order')")
    public ResponseEntity<?> cancel(@PathVariable("id") Long id,
                                    @RequestParam(value = "reason", required = false) String reason) {
        payOSService.cancel(id, reason);
        return new ResponseEntity<>("Payment canceled successfully!", HttpStatus.CREATED);
    }

    @PostMapping("/create-payment-link/{id}")
    @PreAuthorize("hasRole('USER') and hasAuthority('create:order')")
    public ResponseEntity<?> createPaymentLink(HttpServletRequest request,
                                                @PathVariable("id") Long id) {

        PaymentInfo payment = orderService.createPaymentLink(request, id);
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

    @PostMapping("/payos_transfer_handler")
    public ResponseEntity<?> payosTransferHandler(@RequestBody Webhook webhookBody) {
        paymentService.handlePayOS(webhookBody);
        return new ResponseEntity<>("Webhook delivered!", HttpStatus.OK);
    }

    private final PayOS payOS;

    @PostMapping("/confirm-webhook")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('read:order')")
    public ResponseEntity<?> confirmWebhook(@RequestBody ConfirmWebhookRequest request) {
        return new ResponseEntity<>(payOSService.confirmWebhook(request.getWebhookUrl()), HttpStatus.OK);
    }
}
