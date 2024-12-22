package com.ring.bookstore.listener.reset;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
@SuppressWarnings("serial")
public class OnResetPasswordCompletedEvent extends ApplicationEvent {

    private final String username;
    private final String email;

    public OnResetPasswordCompletedEvent(final String username, final String email) {
        super(username);
        this.username = username;
        this.email = email;
    }
}