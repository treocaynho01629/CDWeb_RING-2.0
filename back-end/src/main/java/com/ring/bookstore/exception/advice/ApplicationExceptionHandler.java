package com.ring.bookstore.exception.advice;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.ring.bookstore.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationExceptionHandler{

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ExceptionResponse handleAllException(Exception e) {
        return new ExceptionResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An error occurred!",
                e.getLocalizedMessage()
        );
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(RuntimeException.class)
    public ExceptionResponse handleRuntimeException(RuntimeException e) {
        return new ExceptionResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An internal server error occurred!",
                e.getLocalizedMessage()
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ExceptionResponse handleInvalidArgument(MethodArgumentNotValidException e) {
        Map<String, String> errorsMap = new HashMap<>();

        //Map each request
        e.getBindingResult().getFieldErrors().forEach(error -> {
            errorsMap.put(error.getField(), error.getDefaultMessage());
        });
        return new ExceptionResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid argument",
                errorsMap,
                "Sai định dạng thông tin!"
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MissingRequestCookieException.class)
    public ExceptionResponse handleMissingCookie(MissingRequestCookieException e) {
        return new ExceptionResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Missing cookie request!",
                e.getLocalizedMessage()
        );
    }

    @ExceptionHandler(HttpResponseException.class)
    public ResponseEntity<ExceptionResponse> handleResponseException(HttpResponseException e) {
        ExceptionResponse response = new ExceptionResponse(
                e.getStatus().value(),
                e.getError(),
                e.getMessage()
        );
        return new ResponseEntity<>(response, e.getStatus());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ExceptionResponse handleResourceNotFoundException(ResourceNotFoundException e) {
        return new ExceptionResponse(
                HttpStatus.NOT_FOUND.value(),
                e.getError(),
                e.getMessage()
        );
    }

    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    @ExceptionHandler(ImageResizerException.class)
    public ExceptionResponse handleImageResizerException(ImageResizerException e) {
        return new ExceptionResponse(
                HttpStatus.EXPECTATION_FAILED.value(),
                e.getError(),
                e.getMessage()
        );
    }
    
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ExceptionResponse handleMaxSizeException(MaxUploadSizeExceededException e) {
        return new ExceptionResponse(
                HttpStatus.PAYLOAD_TOO_LARGE.value() ,
                "File size exceed maximum limit!",
                e.getLocalizedMessage()
        );
    }

    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    @ExceptionHandler(HttpClientErrorException.class)
    public ExceptionResponse handleTooManyAttemptsException(HttpClientErrorException e) {
        return new ExceptionResponse(
                HttpStatus.TOO_MANY_REQUESTS.value() ,
                e.getStatusText(),
                e.getLocalizedMessage()
        );
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(BadCredentialsException.class)
    public ExceptionResponse handleBadCredentialsException(BadCredentialsException e) {
        return new ExceptionResponse(
                HttpStatus.FORBIDDEN.value() ,
                "Invalid user!",
                e.getLocalizedMessage()
        );
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(TokenRefreshException.class)
    public ExceptionResponse handleTokenRefreshException(TokenRefreshException e) {
        return new ExceptionResponse(
                HttpStatus.FORBIDDEN.value() ,
                "Refresh token failed!",
                e.getMessage()
        );
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(ResetPasswordException.class)
    public ExceptionResponse handleResetPasswordException(ResetPasswordException e) {
        return new ExceptionResponse(
                HttpStatus.FORBIDDEN.value() ,
                "Reset password failed!",
                e.getMessage()
        );
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(ReCaptchaInvalidException.class)
    public ExceptionResponse handleInvalidReCaptchaException(ReCaptchaInvalidException e) {
        return new ExceptionResponse(
                HttpStatus.FORBIDDEN.value() ,
                "reCaptcha failed!",
                e.getMessage()
        );
    }

    @ResponseStatus(HttpStatus.PRECONDITION_FAILED)
    @ExceptionHandler(ReCaptchaSuspiciousException.class)
    public ExceptionResponse handleSuspiciousReCaptchaException(ReCaptchaSuspiciousException e) {
        return new ExceptionResponse(
                HttpStatus.PRECONDITION_FAILED.value() ,
                "reCaptcha marked suspicious!",
                e.getMessage()
        );
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ExceptionResponse handleValidationException(HttpMessageNotReadableException e) {
        String errorMessage = "";

        if (e.getCause() instanceof InvalidFormatException) {
            InvalidFormatException ifx = (InvalidFormatException) e.getCause();
            if (ifx.getTargetType() != null && ifx.getTargetType().isEnum()) {
                errorMessage = String.format("Invalid enum value: '%s' for the field: '%s'. The value must be one of: %s.",
                        ifx.getValue(), ifx.getPath().get(ifx.getPath().size()-1).getFieldName(), Arrays.toString(ifx.getTargetType().getEnumConstants()));
            }
        }
        return new ExceptionResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Unacceptable JSON " + e.getMessage(),
                errorMessage
        );
    }

    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    @ExceptionHandler(IOException.class)
    public ExceptionResponse handleUploadImageException(IOException e) {
        return new ExceptionResponse(
                HttpStatus.EXPECTATION_FAILED.value(),
                "Failed to upload image!",
                e.getLocalizedMessage()
        );
    }
}
