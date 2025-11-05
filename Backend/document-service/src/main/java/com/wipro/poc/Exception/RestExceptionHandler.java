package com.wipro.poc.Exception;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestControllerAdvice
public class RestExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
    Map<String,Object> body = new HashMap<>();
    body.put("error","Validation failed");
    var details = new ArrayList<Map<String,String>>();
    ex.getBindingResult().getFieldErrors().forEach(err ->
        details.add(Map.of("field", err.getField(), "message", err.getDefaultMessage())));
    body.put("details", details);
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String,Object>> handleGeneric(Exception ex) {
    ex.printStackTrace(); // keep server logs useful
    return ResponseEntity.status(500).body(
        Map.of("error", "Internal Server Error", "message", ex.getMessage()));
  }
}
