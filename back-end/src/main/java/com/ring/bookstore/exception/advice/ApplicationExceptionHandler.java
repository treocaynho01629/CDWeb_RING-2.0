package com.ring.bookstore.exception.advice;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.ring.bookstore.exception.ExceptionMessage;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.exception.HttpResponseException;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationExceptionHandler{

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ExceptionMessage handleInvalidArgument(MethodArgumentNotValidException e) {
        Map<String, String> errorMap = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error -> {
            errorMap.put(error.getField(), error.getDefaultMessage());
        });
        return new ExceptionMessage(HttpStatus.BAD_REQUEST.value(), "Invalid argument", errorMap);
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(RuntimeException.class)
    public ExceptionMessage processRuntimeException(RuntimeException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An internal server error occurred.", errorMap);
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(HttpResponseException.class)
    public ExceptionMessage processSocialException(HttpResponseException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(e.getStatus().value(), e.getStatus().getReasonPhrase(), errorMap);
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ExceptionMessage processResourceNotFoundException(ResourceNotFoundException e) {
        return e.getExceptionMessage();
    }

    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    @ExceptionHandler(ImageResizerException.class)
    public ExceptionMessage processSocialException(ImageResizerException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(e.getStatus().value(), "Failed to resize image!", errorMap);
    }
    
    @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ExceptionMessage handleMaxSizeException(MaxUploadSizeExceededException e) {
    	Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(HttpStatus.PAYLOAD_TOO_LARGE.value() , "File size exceed maximum limit!", errorMap);
    }

    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    @ExceptionHandler(HttpClientErrorException.class)
    public ExceptionMessage handleTooManyAttemptsException(HttpClientErrorException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(HttpStatus.TOO_MANY_REQUESTS.value() , e.getStatusText(), errorMap);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BadCredentialsException.class)
    public ExceptionMessage handleBadCredentialsException(BadCredentialsException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(HttpStatus.BAD_REQUEST.value() , e.getMessage(), errorMap);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ExceptionMessage handleValidationException(HttpMessageNotReadableException e) {
        String errorMessage = "";
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());

        if (e.getCause() instanceof InvalidFormatException) {
            InvalidFormatException ifx = (InvalidFormatException) e.getCause();
            if (ifx.getTargetType() != null && ifx.getTargetType().isEnum()) {
                errorMessage = String.format("Invalid enum value: '%s' for the field: '%s'. The value must be one of: %s.",
                        ifx.getValue(), ifx.getPath().get(ifx.getPath().size()-1).getFieldName(), Arrays.toString(ifx.getTargetType().getEnumConstants()));
            }
        }
        return new ExceptionMessage(HttpStatus.BAD_REQUEST.value(), errorMessage, errorMap);
    }

    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    @ExceptionHandler(IOException.class)
    public ExceptionMessage handleUploadImageException(IOException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(HttpStatus.EXPECTATION_FAILED.value() , "Failed to upload image!", errorMap);
    }
}
