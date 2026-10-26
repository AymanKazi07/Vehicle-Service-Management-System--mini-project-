package com.vehicleservice.service;

import com.vehicleservice.dto.AuthResponse;
import com.vehicleservice.dto.LoginRequest;
import com.vehicleservice.dto.SignupRequest;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.Role;
import com.vehicleservice.model.User;
import com.vehicleservice.store.JsonFileStorage;
import com.vehicleservice.store.UserStore;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {
    private final UserStore userStore;
    private final JwtService jwtService;
    private final JsonFileStorage jsonFileStorage;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserStore userStore, JwtService jwtService, JsonFileStorage jsonFileStorage, PasswordEncoder passwordEncoder) {
        this.userStore = userStore;
        this.jwtService = jwtService;
        this.jsonFileStorage = jsonFileStorage;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userStore.findByEmail(request.getEmail()) != null) {
            throw new ApiException("Email is already registered", HttpStatus.CONFLICT);
        }

        String userId = "cust-" + UUID.randomUUID().toString().substring(0, 8);
        String hash = passwordEncoder.encode(request.getPassword());
        User user = new User(userId, request.getName(), request.getEmail(), hash, Role.CUSTOMER);

        userStore.put(user);
        jsonFileStorage.saveUser(userId);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole(), user.getName());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), null);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userStore.findByEmail(request.getEmail());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole(), user.getName());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getWorkshopId());
    }
}
