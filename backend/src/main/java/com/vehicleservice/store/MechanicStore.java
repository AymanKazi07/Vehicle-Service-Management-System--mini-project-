package com.vehicleservice.store;

import com.vehicleservice.model.Mechanic;
import com.vehicleservice.model.Slot;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MechanicStore {
    private final ConcurrentHashMap<String, Mechanic> mechanicsById = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, TreeMap<LocalDate, List<Slot>>> mechanicSlots = new ConcurrentHashMap<>();

    public ConcurrentHashMap<String, Mechanic> getMechanicsById() {
        return mechanicsById;
    }

    public ConcurrentHashMap<String, TreeMap<LocalDate, List<Slot>>> getMechanicSlots() {
        return mechanicSlots;
    }

    public void putMechanic(Mechanic mechanic) {
        if (mechanic == null || mechanic.getId() == null) return;
        mechanicsById.put(mechanic.getId(), mechanic);
        mechanicSlots.computeIfAbsent(mechanic.getId(), k -> new TreeMap<>());
    }

    public Mechanic findById(String id) {
        if (id == null) return null;
        return mechanicsById.get(id);
    }

    public Collection<Mechanic> findAll() {
        return mechanicsById.values();
    }

    public TreeMap<LocalDate, List<Slot>> getSlotsForMechanic(String mechanicId) {
        if (mechanicId == null) return new TreeMap<>();
        return mechanicSlots.computeIfAbsent(mechanicId, k -> new TreeMap<>());
    }

    public void remove(String id) {
        if (id == null) return;
        mechanicsById.remove(id);
        mechanicSlots.remove(id);
    }

    public void clear() {
        mechanicsById.clear();
        mechanicSlots.clear();
    }
}
