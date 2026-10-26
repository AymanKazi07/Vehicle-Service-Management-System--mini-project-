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
        workshopsById.put(workshop.getId(), workshop);
    }

    public Workshop findById(String id) {
        return workshopsById.get(id);
    }

    public Collection<Workshop> findAll() {
        return workshopsById.values();
    }

    public void remove(String id) {
        workshopsById.remove(id);
    }

    public void clear() {
        workshopsById.clear();
    }
}
