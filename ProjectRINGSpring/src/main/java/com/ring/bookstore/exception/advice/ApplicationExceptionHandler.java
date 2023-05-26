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

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(RuntimeException.class)
    public ExceptionMessage processRuntimeException(RuntimeException e) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(500, "An internal server error occurred.", errorMap);
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
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ExceptionMessage handleMaxSizeException(MaxUploadSizeExceededException e) {
    	Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMessage", e.getMessage());
        return new ExceptionMessage(417 , "File to large!", errorMap);
    }
}
