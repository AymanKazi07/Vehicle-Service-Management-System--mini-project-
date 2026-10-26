package com.vehicleservice;

import com.vehicleservice.dto.AuthResponse;
import com.vehicleservice.dto.LoginRequest;
import com.vehicleservice.dto.SignupRequest;
import com.vehicleservice.dto.VehicleRequest;
import com.vehicleservice.model.Category;
import com.vehicleservice.model.Role;
import com.vehicleservice.model.ServiceRecord;
import com.vehicleservice.model.Vehicle;
import com.vehicleservice.service.AuthService;
import com.vehicleservice.service.VehicleService;
import com.vehicleservice.store.VehicleStore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthAndVehicleTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleStore vehicleStore;

    @Test
    void testSignupLoginAndVehicleLayeredHashing() {
        String email = "testuser" + System.currentTimeMillis() + "@example.com";
        SignupRequest signup = new SignupRequest("Test User", email, "password123");
        AuthResponse auth = authService.signup(signup);

        assertNotNull(auth.getToken());
        assertEquals(email, auth.getEmail());
        assertEquals(Role.CUSTOMER, auth.getRole());

        // Test Login
        LoginRequest login = new LoginRequest(email, "password123");
        AuthResponse loginRes = authService.login(login);
        assertNotNull(loginRes.getToken());
        assertEquals(auth.getUserId(), loginRes.getUserId());

        // Test Add Vehicle
        String regNo = "MH12AB" + (System.currentTimeMillis() % 10000);
        VehicleRequest vReq = new VehicleRequest(regNo, "Test User", "Pulsar 150", Category.TWO_WHEELER, "Geared");
        Vehicle added = vehicleService.addVehicle(auth.getUserId(), vReq);

        assertNotNull(added);
        assertEquals(regNo, added.getRegistrationNumber());

        // Verify layered hashing structure:
        // Layer 1: customerVehicles Map has tree for customerId
        assertNotNull(vehicleStore.getTree(auth.getUserId()));
        // Layer 2: Category.TWO_WHEELER
        assertTrue(vehicleStore.getTree(auth.getUserId()).getTree().containsKey(Category.TWO_WHEELER));
        // Layer 3: Sub-type "Geared"
        List<Vehicle> gearedVehicles = vehicleStore.getTree(auth.getUserId()).getVehicles(Category.TWO_WHEELER, "Geared");
        assertFalse(gearedVehicles.isEmpty());
        assertEquals(regNo, gearedVehicles.get(0).getRegistrationNumber());

        // Secondary O(1) index test
        Vehicle indexed = vehicleStore.findByRegistrationNumber(regNo);
        assertNotNull(indexed);
        assertEquals("Pulsar 150", indexed.getModelName());

        // Test Service History Stack (Push two records)
        ServiceRecord r1 = new ServiceRecord("b-1", LocalDate.now().minusDays(10), List.of("Oil change"), List.of("Mech 1"), "Central Auto", 350.0, 63.0, 413.0);
        ServiceRecord r2 = new ServiceRecord("b-2", LocalDate.now(), List.of("General service"), List.of("Mech 1"), "Central Auto", 600.0, 108.0, 708.0);
        indexed.getServiceHistory().push(r1);
        indexed.getServiceHistory().push(r2);

        List<ServiceRecord> history = vehicleService.getHistory(auth.getUserId(), regNo);
        assertEquals(2, history.size());
        // Stack top is latest, so first in list must be r2
        assertEquals("b-2", history.get(0).getBookingId());
        assertEquals("b-1", history.get(1).getBookingId());
    }
}
