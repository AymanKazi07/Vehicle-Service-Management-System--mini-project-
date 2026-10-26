package com.vehicleservice.service;

import com.vehicleservice.dto.MechanicRequest;
import com.vehicleservice.dto.WorkshopRequest;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.Mechanic;
import com.vehicleservice.model.Role;
import com.vehicleservice.model.User;
import com.vehicleservice.model.Workshop;
import com.vehicleservice.store.JsonFileStorage;
import com.vehicleservice.store.MechanicStore;
import com.vehicleservice.store.UserStore;
import com.vehicleservice.store.WorkshopStore;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AdminService {
    private final WorkshopStore workshopStore;
    private final MechanicStore mechanicStore;
    private final UserStore userStore;
    private final JsonFileStorage jsonFileStorage;
    private final PasswordEncoder passwordEncoder;

    public AdminService(WorkshopStore workshopStore, MechanicStore mechanicStore,
                        UserStore userStore, JsonFileStorage jsonFileStorage,
                        PasswordEncoder passwordEncoder) {
        this.workshopStore = workshopStore;
        this.mechanicStore = mechanicStore;
        this.userStore = userStore;
        this.jsonFileStorage = jsonFileStorage;
        this.passwordEncoder = passwordEncoder;
    }

    public Workshop createWorkshop(WorkshopRequest request) {
        String id = "ws-" + UUID.randomUUID().toString().substring(0, 8);
        Workshop workshop = new Workshop(id, request.getName().trim(), request.getAddress().trim(), request.getContact().trim());
        workshopStore.put(workshop);
        jsonFileStorage.saveWorkshops();
        return workshop;
    }

    public List<Workshop> getWorkshops() {
        return new ArrayList<>(workshopStore.findAll());
    }

    public Mechanic createMechanic(MechanicRequest request) {
        if (userStore.findByEmail(request.getEmail().trim()) != null) {
            throw new ApiException("Email is already registered: " + request.getEmail(), HttpStatus.CONFLICT);
        }

        Workshop workshop = workshopStore.findById(request.getWorkshopId());
        if (workshop == null) {
            throw new ApiException("Workshop not found with id: " + request.getWorkshopId(), HttpStatus.NOT_FOUND);
        }

        String id = "mech-" + UUID.randomUUID().toString().substring(0, 8);
        String passHash = passwordEncoder.encode(request.getPassword());

        User user = new User(id, request.getName().trim(), request.getEmail().trim(), passHash, Role.MECHANIC,
                request.getWorkshopId(), request.getCategories());
        userStore.put(user);

        Mechanic mechanic = new Mechanic(id, request.getName().trim(), request.getEmail().trim(),
                request.getWorkshopId(), request.getCategories());
        mechanicStore.putMechanic(mechanic);

        jsonFileStorage.saveUser(id);
        return mechanic;
    }

    public List<Mechanic> getMechanics() {
        return new ArrayList<>(mechanicStore.findAll());
    }
}
