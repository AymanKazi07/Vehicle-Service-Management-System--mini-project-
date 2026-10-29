package com.vehicleservice.store;

import com.vehicleservice.model.Workshop;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WorkshopStore {
    private final ConcurrentHashMap<String, Workshop> workshopsById = new ConcurrentHashMap<>();

    public ConcurrentHashMap<String, Workshop> getWorkshopsById() {
        return workshopsById;
    }

    public void put(Workshop workshop) {
        if (workshop == null || workshop.getId() == null) return;
        workshopsById.put(workshop.getId(), workshop);
    }

    public Workshop findById(String id) {
        if (id == null) return null;
        return workshopsById.get(id);
    }

    public Collection<Workshop> findAll() {
        return workshopsById.values();
    }

    public void remove(String id) {
        if (id == null) return;
        workshopsById.remove(id);
    }

    public void clear() {
        workshopsById.clear();
    }
}
