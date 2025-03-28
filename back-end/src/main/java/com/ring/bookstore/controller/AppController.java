package com.ring.bookstore.controller;

import com.ring.bookstore.service.ConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AppController {

    private final ConfigService configService;

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        String message = "Health checks at: " + LocalDateTime.now();
        System.out.println(message);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @GetMapping("/enums")
    public ResponseEntity<?> getEnums() {
        return new ResponseEntity<>(configService.getEnums(), HttpStatus.OK);
    }
}
