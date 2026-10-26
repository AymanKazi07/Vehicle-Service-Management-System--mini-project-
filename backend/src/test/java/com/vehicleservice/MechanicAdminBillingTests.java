package com.vehicleservice;

import com.vehicleservice.dto.*;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.*;
import com.vehicleservice.service.*;
import com.vehicleservice.store.VehicleStore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MechanicAdminBillingTests {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AuthService authService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private CatalogService catalogService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MechanicService mechanicService;

    @Autowired
    private BillingService billingService;

    @Autowired
    private VehicleStore vehicleStore;

    @Test
    void testAdminMechanicWorkflowAndBillingWithGST() {
        // 1. Admin creates workshop
        WorkshopRequest wsReq = new WorkshopRequest("East Side Garage", "88 East Wing Rd", "9871112233");
        Workshop workshop = adminService.createWorkshop(wsReq);
        assertNotNull(workshop.getId());

        // 2. Admin creates mechanic
        String mechEmail = "mech" + System.currentTimeMillis() + "@workshop.com";
        MechanicRequest mReq = new MechanicRequest("Karan Singh", mechEmail, "pass1234",
                workshop.getId(), List.of(Category.FOUR_WHEELER));
        Mechanic mechanic = adminService.createMechanic(mReq);
        assertNotNull(mechanic.getId());

        // 3. Customer signs up and registers a 4-wheeler
        String custEmail = "cust" + System.currentTimeMillis() + "@gmail.com";
        AuthResponse custAuth = authService.signup(new SignupRequest("Ravi Varma", custEmail, "pass1234"));
        String regNo = "DL01XY" + (System.currentTimeMillis() % 10000);
        vehicleService.addVehicle(custAuth.getUserId(), new VehicleRequest(regNo, "Ravi Varma", "Honda City", Category.FOUR_WHEELER, "Petrol"));

        // 4. Book a service
        List<ServiceItem> petrolServices = catalogService.getServices(Category.FOUR_WHEELER, "Petrol");
        ServiceItem item = petrolServices.get(0); // e.g. Oil and filter change, 1200 INR
        BookingResponse booking = bookingService.createBooking(custAuth.getUserId(),
                new BookingRequest(regNo, LocalDate.now().plusDays(2), List.of(item.getId())));
        assertEquals(1, booking.getJobs().size());
        String jobId = booking.getJobs().get(0).getJobId();
        String assignedMechId = booking.getJobs().get(0).getMechanicId();

        // 5. Test Mechanic operations & Forward-only status validation
        // Attempting to jump directly from PENDING to COMPLETED should fail
        assertThrows(ApiException.class, () ->
                mechanicService.updateStatus(assignedMechId, jobId, new JobStatusRequest(JobStatus.COMPLETED, "Skipped progress"))
        );

        // Move PENDING -> IN_PROGRESS
        Job inProgress = mechanicService.updateStatus(assignedMechId, jobId, new JobStatusRequest(JobStatus.IN_PROGRESS, "Started service"));
        assertEquals(JobStatus.IN_PROGRESS, inProgress.getStatus());

        // Move IN_PROGRESS -> COMPLETED
        Job completed = mechanicService.updateStatus(assignedMechId, jobId, new JobStatusRequest(JobStatus.COMPLETED, "Oil and filter replaced."));
        assertEquals(JobStatus.COMPLETED, completed.getStatus());

        // 6. Verify Bill is automatically generated with 18% GST
        User customerUser = new User(custAuth.getUserId(), "Ravi Varma", custEmail, "", Role.CUSTOMER);
        Bill bill = billingService.getBillByBookingId(booking.getBookingId(), customerUser);
        assertNotNull(bill);
        assertEquals(item.getPrice(), bill.getSubtotal());
        assertEquals(0.18, bill.getGstRate());
        double expectedGst = Math.round(item.getPrice() * 0.18 * 100.0) / 100.0;
        assertEquals(expectedGst, bill.getGstAmount());
        double expectedTotal = Math.round((item.getPrice() + expectedGst) * 100.0) / 100.0;
        assertEquals(expectedTotal, bill.getGrandTotal());

        // 7. Verify ServiceRecord was pushed onto vehicle's history stack
        Vehicle vehicle = vehicleStore.findByRegistrationNumber(regNo);
        assertFalse(vehicle.getServiceHistory().isEmpty());
        ServiceRecord topRecord = vehicle.getServiceHistory().peek();
        assertEquals(booking.getBookingId(), topRecord.getBookingId());
        assertEquals(expectedTotal, topRecord.getTotal());
    }
}
