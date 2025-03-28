package com.ring.bookstore.config.security;

import com.ring.bookstore.service.impl.LoginProtectionService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

@Component
public class AuthenticationFailureListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

    @Autowired
    private LoginProtectionService loginProtectionService;

    @Override
    public void onApplicationEvent(final AuthenticationFailureBadCredentialsEvent e) {
        RequestAttributes attribs = RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = (HttpServletRequest) ((NativeWebRequest) attribs).getNativeRequest();
        final String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || !xfHeader.contains(request.getRemoteAddr())) {
            loginProtectionService.loginFailed(request.getRemoteAddr());
        } else {
            loginProtectionService.loginFailed(xfHeader.split(",")[0]);
        }
    }
}
