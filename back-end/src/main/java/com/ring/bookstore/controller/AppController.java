package com.ring.bookstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1")
public class AppController {
    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        String message = "Health checks at: " + LocalDateTime.now();
        System.out.println(message);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
