package com.ring.bookstore.exception.advice;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.ring.bookstore.exception.ExceptionMessage;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.exception.HttpResponseException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationExceptionHandler{


    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ExceptionMessage handleInvalidArgument(MethodArgumentNotValidException ex) {
        Map<String, String> errorMap = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errorMap.put(error.getField(), error.getDefaultMessage());
        });
        return new ExceptionMessage(400, "Invalid argument", errorMap);
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionMessage processRuntimeException(RuntimeException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(500, "An internal server error occurred.", errorMap);
    }

    @ExceptionHandler(HttpResponseException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ExceptionMessage processSocialException(HttpResponseException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(e.getStatus().value(), e.getStatus().getReasonPhrase(), errorMap);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionMessage processResourceNotFoundException(ResourceNotFoundException e) {
        return e.getExceptionMessage();
    }
    
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.EXPECTATION_FAILED)
    public ExceptionMessage handleMaxSizeException(MaxUploadSizeExceededException e) {
    	Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(HttpStatus.EXPECTATION_FAILED.value() , "File to large!", errorMap);
    }
}
