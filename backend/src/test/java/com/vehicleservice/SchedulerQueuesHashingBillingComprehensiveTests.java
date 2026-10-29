package com.vehicleservice;

import com.vehicleservice.dto.*;
import com.vehicleservice.model.*;
import com.vehicleservice.scheduler.AgingTask;
import com.vehicleservice.scheduler.LongJobComparator;
import com.vehicleservice.scheduler.ShortJobComparator;
import com.vehicleservice.scheduler.SlotAllocator;
import com.vehicleservice.service.*;
import com.vehicleservice.store.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.PriorityQueue;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SchedulerQueuesHashingBillingComprehensiveTests {

    @Autowired
    private SlotAllocator slotAllocator;

    @Autowired
    private JobStore jobStore;

    @Autowired
    private AgingTask agingTask;

    @Autowired
    private AuthService authService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleStore vehicleStore;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MechanicService mechanicService;

    @Autowired
    private BillingService billingService;

    @Autowired
    private CatalogStore catalogStore;

    @Autowired
    private UserStore userStore;

    @Autowired
    private BookingStore bookingStore;

    @Autowired
    private BillStore billStore;

    @Autowired
    private WorkshopStore workshopStore;

    @Autowired
    private MechanicStore mechanicStore;

    @Test
    void testShortQueueComparatorOrdering() {
        PriorityQueue<Job> testQueue = new PriorityQueue<>(new ShortJobComparator());

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        // Job 1: Tomorrow, 30 min, created now
        Job j1 = new Job("j1", "b1", "c1", "REG1", "s1", "Oil change", 300.0, 30, QueueClass.SHORT,
                tomorrow, LocalTime.of(9, 0), "m1", JobStatus.PENDING, LocalTime.of(9, 30));
        j1.setCreatedAt(LocalDateTime.now().minusMinutes(5));

        // Job 2: Today, 90 min, created now (earlier date should come first)
        Job j2 = new Job("j2", "b1", "c1", "REG1", "s2", "General service", 600.0, 90, QueueClass.SHORT,
                today, LocalTime.of(9, 0), "m1", JobStatus.PENDING, LocalTime.of(10, 30));
        j2.setCreatedAt(LocalDateTime.now());

        // Job 3: Today, 30 min, created now (same date as j2, but shorter duration, so j3 comes before j2)
        Job j3 = new Job("j3", "b1", "c1", "REG1", "s3", "Chain clean", 250.0, 30, QueueClass.SHORT,
                today, LocalTime.of(10, 0), "m1", JobStatus.PENDING, LocalTime.of(10, 30));
        j3.setCreatedAt(LocalDateTime.now().plusMinutes(1));

        testQueue.add(j1);
        testQueue.add(j2);
        testQueue.add(j3);

        // Poll order should be: j3 (today, 30m), then j2 (today, 90m), then j1 (tomorrow, 30m)
        assertEquals("j3", testQueue.poll().getJobId());
        assertEquals("j2", testQueue.poll().getJobId());
        assertEquals("j1", testQueue.poll().getJobId());
    }

    @Test
    void testLongQueueComparatorOrdering() {
        PriorityQueue<Job> testQueue = new PriorityQueue<>(new LongJobComparator());

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        // jA: Tomorrow
        Job jA = new Job("jA", "b1", "c1", "REG1", "s1", "Engine overhaul", 6000.0, 480, QueueClass.LONG,
                tomorrow, LocalTime.of(9, 0), "m1", JobStatus.PENDING, LocalTime.of(18, 0));
        jA.setCreatedAt(LocalDateTime.now().minusHours(2));

        // jB: Today, booked 2 hours ago
        Job jB = new Job("jB", "b1", "c1", "REG1", "s2", "Full painting", 5000.0, 720, QueueClass.LONG,
                today, LocalTime.of(9, 0), "m1", JobStatus.PENDING, LocalTime.of(18, 0));
        jB.setCreatedAt(LocalDateTime.now().minusHours(2));

        // jC: Today, booked 1 hour ago
        Job jC = new Job("jC", "b1", "c1", "REG1", "s3", "Gearbox overhaul", 4000.0, 360, QueueClass.LONG,
                today, LocalTime.of(9, 0), "m1", JobStatus.PENDING, LocalTime.of(18, 0));
        jC.setCreatedAt(LocalDateTime.now().minusHours(1));

        testQueue.add(jA);
        testQueue.add(jB);
        testQueue.add(jC);

        // Poll order: jB (today, booked earlier), then jC (today, booked later), then jA (tomorrow)
        assertEquals("jB", testQueue.poll().getJobId());
        assertEquals("jC", testQueue.poll().getJobId());
        assertEquals("jA", testQueue.poll().getJobId());
    }

    @Test
    void testAgingTaskStarvationGuard() {
        // Create a long job created 3 days ago (exceeds app.aging.days = 2)
        Job oldLongJob = new Job("aged-job-" + System.currentTimeMillis(), "b-old", "c1", "REG-OLD", "s-old",
                "Old Overhaul", 5000.0, 480, QueueClass.LONG, LocalDate.now(), LocalTime.of(9, 0),
                "mech-1", JobStatus.PENDING, LocalTime.of(18, 0));
        oldLongJob.setCreatedAt(LocalDateTime.now().minusDays(3));

        jobStore.getLongQueue().add(oldLongJob);
        assertTrue(jobStore.getLongQueue().contains(oldLongJob));

        // Run AgingTask
        agingTask.checkAgingJobs();

        // Verify it was promoted from longQueue to shortQueue
        assertFalse(jobStore.getLongQueue().contains(oldLongJob));
        assertTrue(jobStore.getShortQueue().contains(oldLongJob));
        assertEquals(QueueClass.SHORT, oldLongJob.getQueueClass());
    }

    @Test
    void testLayeredHashingVehicleTreeAndSecondaryIndex() {
        String customerId = "cust-tree-" + System.currentTimeMillis();
        Vehicle v1 = new Vehicle("DL09AA" + (System.currentTimeMillis() % 1000), "Owner 1", "Activa 6G", Category.TWO_WHEELER, "Scooter");
        Vehicle v2 = new Vehicle("DL09BB" + (System.currentTimeMillis() % 1000), "Owner 1", "Ather 450X", Category.TWO_WHEELER, "EV");
        Vehicle v3 = new Vehicle("DL09CC" + (System.currentTimeMillis() % 1000), "Owner 1", "Tata Nexon EV", Category.FOUR_WHEELER, "EV");

        vehicleStore.addVehicle(customerId, v1);
        vehicleStore.addVehicle(customerId, v2);
        vehicleStore.addVehicle(customerId, v3);

        // Test Layer 1 (customerId lookup)
        VehicleTree tree = vehicleStore.getTree(customerId);
        assertNotNull(tree);

        // Test Layer 2 (Category lookup)
        assertTrue(tree.getTree().containsKey(Category.TWO_WHEELER));
        assertTrue(tree.getTree().containsKey(Category.FOUR_WHEELER));

        // Test Layer 3 (SubType lookup)
        List<Vehicle> scooters = tree.getVehicles(Category.TWO_WHEELER, "Scooter");
        assertEquals(1, scooters.size());
        assertEquals("Activa 6G", scooters.get(0).getModelName());

        List<Vehicle> twoWheelerEvs = tree.getVehicles(Category.TWO_WHEELER, "EV");
        assertEquals(1, twoWheelerEvs.size());
        assertEquals("Ather 450X", twoWheelerEvs.get(0).getModelName());

        List<Vehicle> fourWheelerEvs = tree.getVehicles(Category.FOUR_WHEELER, "EV");
        assertEquals(1, fourWheelerEvs.size());
        assertEquals("Tata Nexon EV", fourWheelerEvs.get(0).getModelName());

        // Secondary O(1) index test
        assertEquals(v1, vehicleStore.findByRegistrationNumber(v1.getRegistrationNumber()));
        assertEquals(v2, vehicleStore.findByRegistrationNumber(v2.getRegistrationNumber()));
        assertEquals(v3, vehicleStore.findByRegistrationNumber(v3.getRegistrationNumber()));
    }

    @Test
    void testBillingFlat18PercentGSTAndHistoryStackPush() {
        String email = "billtest" + System.currentTimeMillis() + "@gmail.com";
        AuthResponse cust = authService.signup(new SignupRequest("Bill Tester", email, "pass1234"));
        String regNo = "TS09XY" + (System.currentTimeMillis() % 10000);
        vehicleService.addVehicle(cust.getUserId(), new VehicleRequest(regNo, "Bill Tester", "Honda Civic", Category.FOUR_WHEELER, "Petrol"));

        // Book 2 services: Oil change (1200) + Battery replacement (800) = Subtotal 2000
        BookingResponse booking = bookingService.createBooking(cust.getUserId(),
                new BookingRequest(regNo, LocalDate.now().plusDays(3), List.of("4w-p-1", "4w-p-2")));

        // Complete both jobs
        for (BookingResponse.JobItemResponse j : booking.getJobs()) {
            mechanicService.updateStatus(j.getMechanicId(), j.getJobId(), new JobStatusRequest(JobStatus.IN_PROGRESS, "Started"));
            mechanicService.updateStatus(j.getMechanicId(), j.getJobId(), new JobStatusRequest(JobStatus.COMPLETED, "Done"));
        }

        // Check Bill
        User custUser = new User(cust.getUserId(), "Bill Tester", email, "", Role.CUSTOMER);
        Bill bill = billingService.getBillByBookingId(booking.getBookingId(), custUser);

        assertNotNull(bill);
        assertEquals(2000.0, bill.getSubtotal());
        assertEquals(0.18, bill.getGstRate());
        assertEquals(360.0, bill.getGstAmount()); // 18% of 2000 = 360
        assertEquals(2360.0, bill.getGrandTotal()); // 2000 + 360 = 2360
        assertEquals(2, bill.getLines().size());

        // Check Service History Stack
        Vehicle v = vehicleStore.findByRegistrationNumber(regNo);
        assertEquals(1, v.getServiceHistory().size());
        ServiceRecord rec = v.getServiceHistory().peek();
        assertEquals(booking.getBookingId(), rec.getBookingId());
        assertEquals(2000.0, rec.getSubtotal());
        assertEquals(360.0, rec.getGst());
        assertEquals(2360.0, rec.getTotal());
    }

    @Test
    void testCatalogStoreNullCategoryAndDeduplication() {
        // Querying services with null category must NOT throw NPE and should return all services
        List<ServiceItem> allServices = catalogStore.getServices(null, null);
        assertNotNull(allServices);
        assertFalse(allServices.isEmpty());

        // Querying with alias or subtype with null category should find matches
        List<ServiceItem> geared = catalogStore.getServices(null, "Geared");
        assertNotNull(geared);
        assertFalse(geared.isEmpty());

        // Verify deduplication: no duplicate service IDs returned
        long uniqueIds = geared.stream().map(ServiceItem::getId).distinct().count();
        assertEquals(geared.size(), uniqueIds);
    }

    @Test
    void testVehicleTreeAndStoresNullSafety() {
        VehicleTree tree = new VehicleTree();
        // Null category and null subType must not crash with NPE
        assertDoesNotThrow(() -> tree.getVehicles(null, null));
        assertDoesNotThrow(() -> tree.getVehicles(Category.TWO_WHEELER, null));
        assertDoesNotThrow(() -> tree.addVehicle(null));

        Vehicle nullFieldsVehicle = new Vehicle("DL99ZZ0001", "Owner", "Model", null, null);
        assertDoesNotThrow(() -> tree.addVehicle(nullFieldsVehicle));

        // Store lookups with null must return null or empty list without throwing NPE
        assertNull(vehicleStore.findByRegistrationNumber(null));
        assertNull(vehicleStore.getTree(null));
        assertTrue(vehicleStore.getVehiclesByCustomerId(null).isEmpty());

        assertNull(userStore.findById(null));
        assertNull(userStore.findByEmail(null));
        assertDoesNotThrow(() -> userStore.remove(null));

        assertNull(jobStore.findById(null));
        assertDoesNotThrow(() -> jobStore.addJob(null));

        assertNull(bookingStore.findById(null));
        assertDoesNotThrow(() -> bookingStore.put(null));

        assertNull(billStore.findByBookingId(null));
        assertDoesNotThrow(() -> billStore.put(null));

        assertNull(workshopStore.findById(null));
        assertDoesNotThrow(() -> workshopStore.remove(null));

        assertNull(mechanicStore.findById(null));
        assertDoesNotThrow(() -> mechanicStore.remove(null));
    }

    @Test
    void testComparatorsNullSafetyAndEdgeCases() {
        ShortJobComparator shortCmp = new ShortJobComparator();
        LongJobComparator longCmp = new LongJobComparator();

        Job jNull1 = null;
        Job jNull2 = null;
        assertEquals(0, shortCmp.compare(jNull1, jNull2));
        assertEquals(0, longCmp.compare(jNull1, jNull2));

        Job jEmptyA = new Job();
        Job jEmptyB = new Job();
        // All fields null: date, expectedMinutes, createdAt
        assertDoesNotThrow(() -> shortCmp.compare(jEmptyA, jEmptyB));
        assertDoesNotThrow(() -> longCmp.compare(jEmptyA, jEmptyB));

        // One null date, one non-null date
        jEmptyA.setDate(LocalDate.now());
        assertTrue(shortCmp.compare(jEmptyA, jEmptyB) < 0);
        assertTrue(longCmp.compare(jEmptyA, jEmptyB) < 0);
    }
}
