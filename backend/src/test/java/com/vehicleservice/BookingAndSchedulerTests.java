package com.vehicleservice;

import com.vehicleservice.dto.AuthResponse;
import com.vehicleservice.dto.BookingRequest;
import com.vehicleservice.dto.BookingResponse;
import com.vehicleservice.dto.SignupRequest;
import com.vehicleservice.dto.VehicleRequest;
import com.vehicleservice.model.Category;
import com.vehicleservice.model.QueueClass;
import com.vehicleservice.model.ServiceItem;
import com.vehicleservice.service.AuthService;
import com.vehicleservice.service.BookingService;
import com.vehicleservice.service.CatalogService;
import com.vehicleservice.service.VehicleService;
import com.vehicleservice.store.JobStore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BookingAndSchedulerTests {

    @Autowired
    private CatalogService catalogService;

    @Autowired
    private AuthService authService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JobStore jobStore;

    @Test
    void testCatalogAndMultiJobScheduling() {
        // 1. Verify Catalog Service
        List<ServiceItem> gearedServices = catalogService.getServices(Category.TWO_WHEELER, "Geared");
        assertFalse(gearedServices.isEmpty());

        ServiceItem shortItem = gearedServices.stream()
                .filter(s -> s.getExpectedMinutes() <= 120)
                .findFirst().orElseThrow();
        assertEquals(QueueClass.SHORT, shortItem.getQueueClass());

        ServiceItem longItem = gearedServices.stream()
                .filter(s -> s.getExpectedMinutes() > 120)
                .findFirst().orElseThrow();
        assertEquals(QueueClass.LONG, longItem.getQueueClass());

        // 2. Setup user and vehicle
        String email = "cust" + System.currentTimeMillis() + "@test.com";
        AuthResponse auth = authService.signup(new SignupRequest("Booking Tester", email, "pass1234"));
        String regNo = "KA01AB" + (System.currentTimeMillis() % 10000);
        vehicleService.addVehicle(auth.getUserId(), new VehicleRequest(regNo, "Booking Tester", "Yamaha R15", Category.TWO_WHEELER, "Geared"));

        // 3. Book both short and long services in one booking
        LocalDate bookDate = LocalDate.now().plusDays(1);
        BookingRequest bReq = new BookingRequest(regNo, bookDate, List.of(shortItem.getId(), longItem.getId()));
        BookingResponse res = bookingService.createBooking(auth.getUserId(), bReq);

        assertNotNull(res);
        assertNotNull(res.getBookingId());
        assertEquals(2, res.getJobs().size());
        assertNotNull(res.getOverallEnd());

        // Check Job 1 (Short)
        BookingResponse.JobItemResponse j1 = res.getJobs().stream()
                .filter(j -> j.getServiceItemId().equals(shortItem.getId()))
                .findFirst().orElseThrow();
        assertEquals(QueueClass.SHORT, j1.getQueueClass());
        assertNotNull(j1.getSlotStart());
        assertNotNull(j1.getEstimatedEnd());
        assertNotNull(j1.getMechanicId());

        // Check Job 2 (Long)
        BookingResponse.JobItemResponse j2 = res.getJobs().stream()
                .filter(j -> j.getServiceItemId().equals(longItem.getId()))
                .findFirst().orElseThrow();
        assertEquals(QueueClass.LONG, j2.getQueueClass());
        assertNotNull(j2.getSlotStart());
        assertNotNull(j2.getEstimatedEnd());
        assertNotNull(j2.getMechanicId());

        // Verify jobs entered JobStore's shortQueue and longQueue
        assertNotNull(jobStore.findById(j1.getJobId()));
        assertNotNull(jobStore.findById(j2.getJobId()));
    }
}
