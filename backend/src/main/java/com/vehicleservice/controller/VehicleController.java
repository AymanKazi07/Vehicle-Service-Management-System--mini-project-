package com.vehicleservice.controller;

import com.vehicleservice.dto.VehicleRequest;
import com.vehicleservice.model.ServiceRecord;
import com.vehicleservice.model.User;
import com.vehicleservice.model.Vehicle;
import com.vehicleservice.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<Vehicle> addVehicle(@AuthenticationPrincipal User user,
                                              @Valid @RequestBody VehicleRequest request) {
        Vehicle vehicle = vehicleService.addVehicle(user.getId(), request);
        return new ResponseEntity<>(vehicle, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getVehicles(@AuthenticationPrincipal User user) {
        List<Vehicle> vehicles = vehicleService.getVehicles(user.getId());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{regNo}/history")
    public ResponseEntity<List<ServiceRecord>> getHistory(@AuthenticationPrincipal User user,
                                                          @PathVariable String regNo) {
        List<ServiceRecord> history = vehicleService.getHistory(user.getId(), regNo);
        return ResponseEntity.ok(history);
    }
}
