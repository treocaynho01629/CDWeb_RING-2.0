package com.ring.bookstore.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;

@Service
public class ScheduleService {
    @Scheduled(cron = "0 0/12 * * * *") //Every 12 minutes
    public void execute() {
        System.out.println("Health checks at: " + LocalDateTime.now());
    }
}
