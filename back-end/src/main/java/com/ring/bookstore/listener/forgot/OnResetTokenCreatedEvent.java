package com.ring.bookstore.listener.forgot;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * {@link OnResetTokenCreatedEvent} is an event that is triggered when a user request a reset token.
 */
@Getter
public class OnResetTokenCreatedEvent extends ApplicationEvent {

    private final String username;
    private final String email;
    private final String token;

    public OnResetTokenCreatedEvent(final String username, final String email, final String token) {
        super(username);
        this.username = username;
        this.email = email;
        this.token = token;
    }
}