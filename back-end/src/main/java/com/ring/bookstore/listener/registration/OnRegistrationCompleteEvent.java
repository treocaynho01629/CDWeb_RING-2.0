package com.ring.bookstore.listener.registration;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
@SuppressWarnings("serial")
public class OnRegistrationCompleteEvent extends ApplicationEvent {

    private final String username;
    private final String email;

    public OnRegistrationCompleteEvent(final String username, final String email) {
        super(username);
        this.username = username;
        this.email = email;
    }
}