package com.ring.bookstore.service.impl;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service("captchaProtectionService")
public class CaptchaProtectionService {
    private final int MAX_ATTEMPT = 5;
    private LoadingCache<String, Integer> attemptsCache;

    public CaptchaProtectionService() {
        attemptsCache = CacheBuilder.newBuilder().expireAfterWrite(4, TimeUnit.HOURS).build(new CacheLoader<String, Integer>() {
            @Override
            public Integer load(final String key) {
                return 0;
            }
        });
    }

    public void captchaSucceeded(final String key) {
        attemptsCache.invalidate(key);
    }

    public void captchaFailed(final String key) {
        int attempts = attemptsCache.getUnchecked(key);
        attempts++;
        attemptsCache.put(key, attempts);
    }

    public boolean isBlocked(final String key) {
        return attemptsCache.getUnchecked(key) >= MAX_ATTEMPT;
    }
}
