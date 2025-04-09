package com.ring.bookstore.controller;

import com.ring.bookstore.service.ConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * Controller class named {@link AppController} for handling basic application-related operations.
 * Exposes endpoints under "/api/v1".
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AppController {

    private final ConfigService configService;

    /**
     * Endpoint for checking the health of the application.
     *
     * @return a {@link ResponseEntity} containing the health check message and current timestamp.
     */
    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        String message = "Health checks at: " + LocalDateTime.now();
        System.out.println(message);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    /**
     * Endpoint for retrieving application enums.
     *
     * @return a {@link ResponseEntity} containing the enums data.
     */
    @GetMapping("/enums")
    public ResponseEntity<?> getEnums() {
        return new ResponseEntity<>(configService.getEnums(), HttpStatus.OK);
    }
}
