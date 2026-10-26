package com.vehicleservice.store;

import com.vehicleservice.model.Vehicle;
import com.vehicleservice.model.VehicleTree;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class VehicleStore {
    private final ConcurrentHashMap<String, VehicleTree> customerVehicles = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Vehicle> vehicleIndex = new ConcurrentHashMap<>();

    public ConcurrentHashMap<String, VehicleTree> getCustomerVehicles() {
        return customerVehicles;
    }

    public ConcurrentHashMap<String, Vehicle> getVehicleIndex() {
        return vehicleIndex;
    }

    public VehicleTree getOrCreateTree(String customerId) {
        return customerVehicles.computeIfAbsent(customerId, k -> new VehicleTree());
    }

    public VehicleTree getTree(String customerId) {
        return customerVehicles.get(customerId);
    }

    public void addVehicle(String customerId, Vehicle vehicle) {
        VehicleTree tree = getOrCreateTree(customerId);
        tree.addVehicle(vehicle);
        if (vehicle.getRegistrationNumber() != null) {
            vehicleIndex.put(vehicle.getRegistrationNumber().toUpperCase(), vehicle);
        }
    }

    public Vehicle findByRegistrationNumber(String regNo) {
        if (regNo == null) return null;
        return vehicleIndex.get(regNo.toUpperCase());
    }

    public List<Vehicle> getVehiclesByCustomerId(String customerId) {
        VehicleTree tree = customerVehicles.get(customerId);
        if (tree == null) {
            return List.of();
        }
        return tree.getAllVehicles();
    }

    public void clear() {
        customerVehicles.clear();
        vehicleIndex.clear();
    }
}
