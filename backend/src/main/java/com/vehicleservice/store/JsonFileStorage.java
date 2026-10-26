package com.vehicleservice.store;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.vehicleservice.config.AppProperties;
import com.vehicleservice.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.InputStream;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

@Component
public class JsonFileStorage {
    private static final Logger log = LoggerFactory.getLogger(JsonFileStorage.class);

    private final ConcurrentHashMap<String, ReentrantLock> userLocks = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private final AppProperties appProperties;
    private final UserStore userStore;
    private final VehicleStore vehicleStore;
    private final CatalogStore catalogStore;
    private final WorkshopStore workshopStore;
    private final MechanicStore mechanicStore;
    private final JobStore jobStore;
    private final BookingStore bookingStore;
    private final BillStore billStore;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public JsonFileStorage(AppProperties appProperties, UserStore userStore, VehicleStore vehicleStore,
                           CatalogStore catalogStore, WorkshopStore workshopStore, MechanicStore mechanicStore,
                           JobStore jobStore, BookingStore bookingStore, BillStore billStore) {
        this.appProperties = appProperties;
        this.userStore = userStore;
        this.vehicleStore = vehicleStore;
        this.catalogStore = catalogStore;
        this.workshopStore = workshopStore;
        this.mechanicStore = mechanicStore;
        this.jobStore = jobStore;
        this.bookingStore = bookingStore;
        this.billStore = billStore;

        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public ConcurrentHashMap<String, ReentrantLock> getUserLocks() {
        return userLocks;
    }

    public ReentrantLock getLock(String userId) {
        return userLocks.computeIfAbsent(userId, k -> new ReentrantLock());
    }

    public synchronized void saveWorkshops() {
        try {
            Path dir = Paths.get(appProperties.getDataDir());
            Files.createDirectories(dir);
            Path target = dir.resolve("workshops.json");
            Path temp = dir.resolve("workshops.json.tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(temp.toFile(), workshopStore.findAll());
            moveFile(temp, target);
        } catch (Exception e) {
            log.error("Failed to save workshops: {}", e.getMessage(), e);
        }
    }

    public synchronized void saveCatalog() {
        try {
            Path dir = Paths.get(appProperties.getDataDir());
            Files.createDirectories(dir);
            Path target = dir.resolve("catalog.json");
            Path temp = dir.resolve("catalog.json.tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(temp.toFile(), catalogStore.getCatalog());
            moveFile(temp, target);
        } catch (Exception e) {
            log.error("Failed to save catalog: {}", e.getMessage(), e);
        }
    }

    public void saveUser(String userId) {
        if (userId == null) return;
        ReentrantLock lock = getLock(userId);
        lock.lock();
        try {
            User user = userStore.findById(userId);
            if (user == null) {
                return;
            }
            Path usersDir = Paths.get(appProperties.getDataDir(), "users");
            Files.createDirectories(usersDir);
            Path target = usersDir.resolve(userId + ".json");
            Path temp = usersDir.resolve(userId + ".json.tmp");

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("user", user);

            if (user.getRole() == Role.CUSTOMER) {
                List<Vehicle> vehicles = vehicleStore.getVehiclesByCustomerId(userId);
                payload.put("vehicles", vehicles);

                List<Booking> customerBookings = bookingStore.findByCustomerId(userId);
                payload.put("bookings", customerBookings);

                List<Job> customerJobs = new ArrayList<>();
                List<Bill> customerBills = new ArrayList<>();
                for (Booking b : customerBookings) {
                    for (String jId : b.getJobIds()) {
                        Job j = jobStore.findById(jId);
                        if (j != null) customerJobs.add(j);
                    }
                    Bill bill = billStore.findByBookingId(b.getBookingId());
                    if (bill != null) customerBills.add(bill);
                }
                payload.put("jobs", customerJobs);
                payload.put("bills", customerBills);
            } else if (user.getRole() == Role.MECHANIC) {
                Mechanic mechanic = mechanicStore.findById(userId);
                payload.put("mechanic", mechanic);
                TreeMap<LocalDate, List<Slot>> slots = mechanicStore.getSlotsForMechanic(userId);
                payload.put("slots", slots);
            }

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(temp.toFile(), payload);
            moveFile(temp, target);
        } catch (Exception e) {
            log.error("Failed to save user {}: {}", userId, e.getMessage(), e);
        } finally {
            lock.unlock();
        }
    }

    private void moveFile(Path source, Path target) throws Exception {
        try {
            Files.move(source, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
        } catch (AtomicMoveNotSupportedException e) {
            Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    public synchronized void loadAll() {
        try {
            Path baseDir = Paths.get(appProperties.getDataDir());
            Files.createDirectories(baseDir);
            Path usersDir = baseDir.resolve("users");
            Files.createDirectories(usersDir);

            // 1. Load Catalog
            loadCatalog(baseDir);

            // 2. Load Workshops
            loadWorkshops(baseDir);

            // 3. Load Users
            loadUsers(usersDir);

            // 4. Seed if empty
            seedInitialDataIfNecessary();

            // 5. Rebuild Priority Queues from Pending Jobs
            rebuildQueues();

            log.info("Finished loading all data from disk.");
        } catch (Exception e) {
            log.error("Failed during loadAll(): {}", e.getMessage(), e);
        }
    }

    private void loadCatalog(Path baseDir) {
        Path catalogFile = baseDir.resolve("catalog.json");
        try {
            if (Files.exists(catalogFile) && Files.size(catalogFile) > 0) {
                Map<Category, Map<String, List<ServiceItem>>> data = objectMapper.readValue(
                        catalogFile.toFile(),
                        new TypeReference<>() {}
                );
                catalogStore.clear();
                data.forEach((cat, subMap) -> subMap.forEach((sub, list) -> {
                    for (ServiceItem item : list) {
                        catalogStore.addService(cat, sub, item);
                    }
                }));
            } else {
                // Load from seed
                ClassPathResource seedResource = new ClassPathResource("seed/catalog-seed.json");
                if (seedResource.exists()) {
                    try (InputStream is = seedResource.getInputStream()) {
                        Map<Category, Map<String, List<ServiceItem>>> data = objectMapper.readValue(
                                is,
                                new TypeReference<>() {}
                        );
                        catalogStore.clear();
                        data.forEach((cat, subMap) -> subMap.forEach((sub, list) -> {
                            for (ServiceItem item : list) {
                                catalogStore.addService(cat, sub, item);
                            }
                        }));
                        saveCatalog();
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to load catalog: {}", e.getMessage(), e);
        }
    }

    private void loadWorkshops(Path baseDir) {
        Path workshopsFile = baseDir.resolve("workshops.json");
        if (Files.exists(workshopsFile)) {
            try {
                List<Workshop> workshops = objectMapper.readValue(
                        workshopsFile.toFile(),
                        new TypeReference<>() {}
                );
                workshopStore.clear();
                for (Workshop ws : workshops) {
                    workshopStore.put(ws);
                }
            } catch (Exception e) {
                log.error("Failed to load workshops: {}", e.getMessage(), e);
            }
        }
    }

    private void loadUsers(Path usersDir) {
        File[] files = usersDir.toFile().listFiles((dir, name) -> name.endsWith(".json"));
        if (files == null) return;

        for (File f : files) {
            try {
                Map<String, Object> payload = objectMapper.readValue(f, new TypeReference<>() {});
                User user = objectMapper.convertValue(payload.get("user"), User.class);
                if (user == null) continue;
                userStore.put(user);

                if (user.getRole() == Role.CUSTOMER) {
                    // Vehicles
                    if (payload.containsKey("vehicles")) {
                        List<Map<String, Object>> vList = objectMapper.convertValue(
                                payload.get("vehicles"),
                                new TypeReference<>() {}
                        );
                        for (Map<String, Object> vm : vList) {
                            Vehicle v = new Vehicle();
                            v.setRegistrationNumber((String) vm.get("registrationNumber"));
                            v.setOwnerName((String) vm.get("ownerName"));
                            v.setModelName((String) vm.get("modelName"));
                            if (vm.get("category") != null) {
                                v.setCategory(Category.valueOf((String) vm.get("category")));
                            }
                            v.setSubType((String) vm.get("subType"));

                            Stack<ServiceRecord> stack = new Stack<>();
                            if (vm.containsKey("serviceHistory")) {
                                List<ServiceRecord> recs = objectMapper.convertValue(
                                        vm.get("serviceHistory"),
                                        new TypeReference<>() {}
                                );
                                for (ServiceRecord r : recs) {
                                    stack.push(r);
                                }
                            }
                            v.setServiceHistory(stack);
                            vehicleStore.addVehicle(user.getId(), v);
                        }
                    }

                    // Bookings
                    if (payload.containsKey("bookings")) {
                        List<Booking> bookings = objectMapper.convertValue(
                                payload.get("bookings"),
                                new TypeReference<>() {}
                        );
                        for (Booking b : bookings) {
                            bookingStore.put(b);
                        }
                    }

                    // Jobs
                    if (payload.containsKey("jobs")) {
                        List<Job> jobs = objectMapper.convertValue(
                                payload.get("jobs"),
                                new TypeReference<>() {}
                        );
                        for (Job j : jobs) {
                            jobStore.addJob(j);
                        }
                    }

                    // Bills
                    if (payload.containsKey("bills")) {
                        List<Bill> bills = objectMapper.convertValue(
                                payload.get("bills"),
                                new TypeReference<>() {}
                        );
                        for (Bill b : bills) {
                            billStore.put(b);
                        }
                    }
                } else if (user.getRole() == Role.MECHANIC) {
                    Mechanic mechanic = objectMapper.convertValue(payload.get("mechanic"), Mechanic.class);
                    if (mechanic == null) {
                        mechanic = new Mechanic(user.getId(), user.getName(), user.getEmail(), user.getWorkshopId(), user.getCategories());
                    }
                    mechanicStore.putMechanic(mechanic);

                    if (payload.containsKey("slots")) {
                        Map<String, List<Slot>> slotMap = objectMapper.convertValue(
                                payload.get("slots"),
                                new TypeReference<>() {}
                        );
                        TreeMap<LocalDate, List<Slot>> tMap = mechanicStore.getSlotsForMechanic(user.getId());
                        slotMap.forEach((dtStr, list) -> tMap.put(LocalDate.parse(dtStr), list));
                    }
                }
            } catch (Exception e) {
                log.error("Failed to load user file {}: {}", f.getName(), e.getMessage(), e);
            }
        }
    }

    private void seedInitialDataIfNecessary() {
        // Seed 1 Workshop if none exist
        if (workshopStore.findAll().isEmpty()) {
            Workshop ws = new Workshop("ws-1", "Central Auto Care", "123 Main Street, Sector 5", "+91 9876543210");
            workshopStore.put(ws);
            saveWorkshops();
            log.info("Seeded default workshop: {}", ws.getId());
        }

        // Seed 1 Admin if none exist
        boolean hasAdmin = userStore.findAll().stream().anyMatch(u -> u.getRole() == Role.ADMIN);
        if (!hasAdmin) {
            User admin = new User(
                    "admin-1",
                    "System Admin",
                    "admin@vehicleservice.com",
                    passwordEncoder.encode("admin123"),
                    Role.ADMIN
            );
            userStore.put(admin);
            saveUser(admin.getId());
            log.info("Seeded default admin: admin@vehicleservice.com");
        }

        // Seed 2 Mechanics if none exist
        boolean hasMechanic = userStore.findAll().stream().anyMatch(u -> u.getRole() == Role.MECHANIC);
        if (!hasMechanic) {
            String wsId = workshopStore.findAll().iterator().next().getId();

            User m1 = new User(
                    "mech-1",
                    "Rajesh Kumar",
                    "rajesh@vehicleservice.com",
                    passwordEncoder.encode("mech123"),
                    Role.MECHANIC,
                    wsId,
                    List.of(Category.TWO_WHEELER, Category.THREE_WHEELER)
            );
            userStore.put(m1);
            Mechanic mech1 = new Mechanic(m1.getId(), m1.getName(), m1.getEmail(), wsId, m1.getCategories());
            mechanicStore.putMechanic(mech1);
            saveUser(m1.getId());

            User m2 = new User(
                    "mech-2",
                    "Amit Sharma",
                    "amit@vehicleservice.com",
                    passwordEncoder.encode("mech123"),
                    Role.MECHANIC,
                    wsId,
                    List.of(Category.FOUR_WHEELER, Category.HEAVY)
            );
            userStore.put(m2);
            Mechanic mech2 = new Mechanic(m2.getId(), m2.getName(), m2.getEmail(), wsId, m2.getCategories());
            mechanicStore.putMechanic(mech2);
            saveUser(m2.getId());

            log.info("Seeded 2 default mechanics: rajesh@vehicleservice.com and amit@vehicleservice.com");
        }
    }

    private void rebuildQueues() {
        jobStore.getShortQueue().clear();
        jobStore.getLongQueue().clear();
        for (Job job : jobStore.findAll()) {
            if (job.getStatus() == JobStatus.PENDING) {
                if (job.getQueueClass() == QueueClass.SHORT) {
                    jobStore.getShortQueue().add(job);
                } else {
                    jobStore.getLongQueue().add(job);
                }
            }
        }
    }
}
