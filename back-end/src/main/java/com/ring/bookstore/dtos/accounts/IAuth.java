package com.ring.bookstore.dtos.accounts;

import com.ring.bookstore.model.Account;

public interface IAuth {
    Account getAccount();
    String publicId();
}
