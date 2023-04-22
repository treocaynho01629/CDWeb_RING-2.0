package com.ring.bookstore.exception;

import lombok.Data;

@Data
public class Message {

    private String senderName;
    private String targetUserName;
    private String message;
}