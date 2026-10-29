package com.vehicleservice.service;

import com.vehicleservice.dto.VehicleRequest;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.ServiceRecord;
import com.vehicleservice.model.Vehicle;
import com.vehicleservice.store.JsonFileStorage;
import com.vehicleservice.store.VehicleStore;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class VehicleService {
    private final VehicleStore vehicleStore;
    private final JsonFileStorage jsonFileStorage;

    public VehicleService(VehicleStore vehicleStore, JsonFileStorage jsonFileStorage) {
        this.vehicleStore = vehicleStore;
        this.jsonFileStorage = jsonFileStorage;
    }

    public Vehicle addVehicle(String customerId, VehicleRequest request) {
        String regNo = VehicleStore.normalizeRegNo(request.getRegistrationNumber());
        if (vehicleStore.findByRegistrationNumber(regNo) != null) {
            throw new ApiException("Vehicle with registration number " + regNo + " is already registered", HttpStatus.CONFLICT);
        }

        Vehicle vehicle = new Vehicle(
                regNo,
                request.getOwnerName() != null ? request.getOwnerName().trim() : "",
                request.getModelName() != null ? request.getModelName().trim() : "",
                request.getCategory(),
                request.getSubType() != null ? request.getSubType().trim() : "DEFAULT"
        );

        vehicleStore.addVehicle(customerId, vehicle);
        jsonFileStorage.saveUser(customerId);
        return vehicle;
    }

    public List<Vehicle> getVehicles(String customerId) {
        return vehicleStore.getVehiclesByCustomerId(customerId);
    }

    public List<ServiceRecord> getHistory(String customerId, String regNo) {
        Vehicle vehicle = vehicleStore.findByRegistrationNumber(regNo);
        if (vehicle == null) {
            throw new ApiException("Vehicle not found with registration number " + regNo, HttpStatus.NOT_FOUND);
        }

        // Verify that the vehicle belongs to this customer
        boolean owned = vehicleStore.getVehiclesByCustomerId(customerId).stream()
                .anyMatch(v -> VehicleStore.normalizeRegNo(v.getRegistrationNumber()).equals(VehicleStore.normalizeRegNo(regNo)));
        if (!owned) {
            throw new ApiException("Access denied: You do not own this vehicle", HttpStatus.FORBIDDEN);
        }

        // Return latest first (from top of stack to bottom)
        if (vehicle.getServiceHistory() == null || vehicle.getServiceHistory().isEmpty()) {
            return Collections.emptyList();
        }
        List<ServiceRecord> history = new ArrayList<>(vehicle.getServiceHistory());
        Collections.reverse(history);
        return history;
    }
}
