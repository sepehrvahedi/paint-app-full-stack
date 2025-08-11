package com.example.canvasdrawingapi.controller;

import com.example.canvasdrawingapi.dto.ApiResponse;
import com.example.canvasdrawingapi.dto.auth.AuthResponse;
import com.example.canvasdrawingapi.dto.auth.LoginRequest;
import com.example.canvasdrawingapi.dto.auth.RegisterRequest;
import com.example.canvasdrawingapi.model.User;
import com.example.canvasdrawingapi.security.JwtUtil;
import com.example.canvasdrawingapi.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error("User with this username already exists"));
            }

            User user = userService.createUser(request.getUsername(), request.getPassword());
            String token = jwtUtil.generateJwtToken(user.getId());

            AuthResponse authResponse = new AuthResponse(user, token);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", authResponse));
        } catch (Exception e) {
            logger.error("Register error:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error during registration"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            logger.debug("Login request: {}", request.getUsername());

            Optional<User> userOptional = userService.findByUsername(request.getUsername());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid credentials"));
            }

            User user = userOptional.get();
            logger.debug("Found user: ID: {}, Username: {}", user.getId(), user.getUsername());

            boolean isValidPassword = userService.validatePassword(user, request.getPassword());
            logger.debug("Password valid: {}", isValidPassword);

            if (!isValidPassword) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid credentials"));
            }

            String token = jwtUtil.generateJwtToken(user.getId());
            AuthResponse authResponse = new AuthResponse(user, token);

            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
        } catch (Exception e) {
            logger.error("Login error:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error during login"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getMe(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            
            Optional<User> userOptional = userService.findById(userId);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            User user = userOptional.get();
            AuthResponse authResponse = new AuthResponse(user, null);

            return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", authResponse));
        } catch (Exception e) {
            logger.error("Get me error:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error"));
        }
    }
}
