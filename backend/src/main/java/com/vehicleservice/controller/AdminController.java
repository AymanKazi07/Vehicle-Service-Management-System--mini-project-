package com.vehicleservice.controller;

import com.vehicleservice.dto.MechanicRequest;
import com.vehicleservice.dto.WorkshopRequest;
import com.vehicleservice.model.Booking;
import com.vehicleservice.model.Mechanic;
import com.vehicleservice.model.ServiceItem;
import com.vehicleservice.model.Workshop;
import com.vehicleservice.service.AdminService;
import com.vehicleservice.service.CatalogService;
import com.vehicleservice.store.BookingStore;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private final CatalogService catalogService;
    private final BookingStore bookingStore;

    public AdminController(AdminService adminService, CatalogService catalogService, BookingStore bookingStore) {
        this.adminService = adminService;
        this.catalogService = catalogService;
        this.bookingStore = bookingStore;
    }

    @PostMapping("/workshops")
    public ResponseEntity<Workshop> createWorkshop(@Valid @RequestBody WorkshopRequest request) {
        Workshop workshop = adminService.createWorkshop(request);
        return new ResponseEntity<>(workshop, HttpStatus.CREATED);
    }

    @GetMapping("/workshops")
    public ResponseEntity<List<Workshop>> getWorkshops() {
        return ResponseEntity.ok(adminService.getWorkshops());
    }

    @PostMapping("/mechanics")
    public ResponseEntity<Mechanic> createMechanic(@Valid @RequestBody MechanicRequest request) {
        Mechanic mechanic = adminService.createMechanic(request);
        return new ResponseEntity<>(mechanic, HttpStatus.CREATED);
    }

    @GetMapping("/mechanics")
    public ResponseEntity<List<Mechanic>> getMechanics() {
        return ResponseEntity.ok(adminService.getMechanics());
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceItem> updateService(@PathVariable String id, @RequestBody ServiceItem item) {
        ServiceItem updated = catalogService.updateService(id, item);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(new ArrayList<>(bookingStore.findAll()));
    }
}
