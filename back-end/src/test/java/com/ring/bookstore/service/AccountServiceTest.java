package com.ring.bookstore.service;

import com.ring.bookstore.repository.AccountRepository;
import com.ring.bookstore.service.impl.AccountServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    AccountRepository accRepo;
    @InjectMocks
    AccountServiceImpl accService;
}