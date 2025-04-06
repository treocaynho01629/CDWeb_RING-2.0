package com.ring.bookstore.model.dto.response.accounts;

import com.ring.bookstore.model.entity.Account;

public interface IAuth {
    Account getAccount();
    String publicId();
}
