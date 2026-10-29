package com.vehicleservice.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class VehicleTree {
    private Map<Category, Map<String, List<Vehicle>>> tree = new ConcurrentHashMap<>();

    public VehicleTree() {
        for (Category category : Category.values()) {
            tree.put(category, new ConcurrentHashMap<>());
        }
    }

    public Map<Category, Map<String, List<Vehicle>>> getTree() {
        return tree;
    }

    public void setTree(Map<Category, Map<String, List<Vehicle>>> tree) {
        this.tree = tree;
    }

    public void addVehicle(Vehicle vehicle) {
        if (vehicle == null) return;
        Category cat = vehicle.getCategory() != null ? vehicle.getCategory() : Category.TWO_WHEELER;
        String sub = vehicle.getSubType() != null && !vehicle.getSubType().isBlank() ? vehicle.getSubType() : "DEFAULT";
        tree.computeIfAbsent(cat, c -> new ConcurrentHashMap<>())
            .computeIfAbsent(sub, st -> new CopyOnWriteArrayList<>())
            .add(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        List<Vehicle> all = new ArrayList<>();
        for (Map<String, List<Vehicle>> subTypeMap : tree.values()) {
            for (List<Vehicle> list : subTypeMap.values()) {
                all.addAll(list);
            }
        }
        return all;
    }

    public List<Vehicle> getVehicles(Category category, String subType) {
        if (category == null) return getAllVehicles();
        Map<String, List<Vehicle>> subTypeMap = tree.get(category);
        if (subTypeMap == null) return Collections.emptyList();
        if (subType == null || subType.isBlank()) {
            List<Vehicle> all = new ArrayList<>();
            subTypeMap.values().forEach(all::addAll);
            return all;
        }
        for (Map.Entry<String, List<Vehicle>> entry : subTypeMap.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(subType)) {
                return entry.getValue();
            }
        }
        return Collections.emptyList();
    }
}
