package com.vehicleservice.controller;

import com.vehicleservice.dto.BookingRequest;
import com.vehicleservice.dto.BookingResponse;
import com.vehicleservice.model.User;
import com.vehicleservice.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@AuthenticationPrincipal User user,
                                                         @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(user.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings(@AuthenticationPrincipal User user) {
        List<BookingResponse> responses = bookingService.getBookings(user.getId());
        return ResponseEntity.ok(responses);
    }
}
