package com.wipro.poc.Exception;



import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("timestamp", OffsetDateTime.now().toString(),
             "status", 404, "error", "Not Found", "message", ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
    var errors = ex.getBindingResult().getFieldErrors().stream()
        .map(f -> Map.of("field", f.getField(), "message", f.getDefaultMessage()))
        .toList();
    return ResponseEntity.badRequest().body(
      Map.of("timestamp", OffsetDateTime.now().toString(),
             "status", 400, "error", "Bad Request", "messages", errors));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleGeneric(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
      Map.of("timestamp", OffsetDateTime.now().toString(),
             "status", 500, "error", "Internal Server Error", "message", ex.getMessage()));
  }
}
