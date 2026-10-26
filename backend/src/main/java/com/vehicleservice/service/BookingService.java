package com.vehicleservice.service;

import com.vehicleservice.dto.BookingRequest;
import com.vehicleservice.dto.BookingResponse;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.*;
import com.vehicleservice.store.BookingStore;
import com.vehicleservice.store.JobStore;
import com.vehicleservice.store.JsonFileStorage;
import com.vehicleservice.store.MechanicStore;
import com.vehicleservice.store.VehicleStore;
import com.vehicleservice.store.WorkshopStore;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final CatalogService catalogService;
    private final VehicleStore vehicleStore;
    private final SchedulerService schedulerService;
    private final BookingStore bookingStore;
    private final JobStore jobStore;
    private final MechanicStore mechanicStore;
    private final WorkshopStore workshopStore;
    private final JsonFileStorage jsonFileStorage;

    public BookingService(CatalogService catalogService, VehicleStore vehicleStore,
                          SchedulerService schedulerService, BookingStore bookingStore,
                          JobStore jobStore, MechanicStore mechanicStore, WorkshopStore workshopStore,
                          JsonFileStorage jsonFileStorage) {
        this.catalogService = catalogService;
        this.vehicleStore = vehicleStore;
        this.schedulerService = schedulerService;
        this.bookingStore = bookingStore;
        this.jobStore = jobStore;
        this.mechanicStore = mechanicStore;
        this.workshopStore = workshopStore;
        this.jsonFileStorage = jsonFileStorage;
    }

    public BookingResponse createBooking(String customerId, BookingRequest request) {
        String regNo = request.getVehicleRegNo().trim().toUpperCase();
        Vehicle vehicle = vehicleStore.findByRegistrationNumber(regNo);
        if (vehicle == null) {
            throw new ApiException("Vehicle not found with registration number " + regNo, HttpStatus.NOT_FOUND);
        }

        // Verify customer owns this vehicle
        boolean owned = vehicleStore.getVehiclesByCustomerId(customerId).stream()
                .anyMatch(v -> v.getRegistrationNumber().equalsIgnoreCase(regNo));
        if (!owned) {
            throw new ApiException("Access denied: You do not own vehicle " + regNo, HttpStatus.FORBIDDEN);
        }

        if (request.getServiceItemIds() == null || request.getServiceItemIds().isEmpty()) {
            throw new ApiException("At least one service item must be selected");
        }

        String bookingId = "bk-" + UUID.randomUUID().toString().substring(0, 8);
        List<String> jobIds = new ArrayList<>();
        List<Job> scheduledJobs = new ArrayList<>();
        Set<String> involvedMechanics = new HashSet<>();

        LocalTime overallEnd = null;

        for (String serviceId : request.getServiceItemIds()) {
            ServiceItem item = catalogService.getServiceById(serviceId);
            String jobId = "job-" + UUID.randomUUID().toString().substring(0, 8);

            Job job = new Job();
            job.setJobId(jobId);
            job.setBookingId(bookingId);
            job.setCustomerId(customerId);
            job.setVehicleRegNo(vehicle.getRegistrationNumber());
            job.setServiceItemId(item.getId());
            job.setServiceName(item.getName());
            job.setPrice(item.getPrice());
            job.setExpectedMinutes(item.getExpectedMinutes());
            job.setDate(request.getDate());
            job.setStatus(JobStatus.PENDING);

            Job scheduled = schedulerService.schedule(job, vehicle.getCategory());
            scheduledJobs.add(scheduled);
            jobIds.add(jobId);
            if (scheduled.getMechanicId() != null) {
                involvedMechanics.add(scheduled.getMechanicId());
            }

            if (overallEnd == null || (scheduled.getEstimatedEnd() != null && scheduled.getEstimatedEnd().isAfter(overallEnd))) {
                overallEnd = scheduled.getEstimatedEnd();
            }
        }

        Booking booking = new Booking(bookingId, customerId, vehicle.getRegistrationNumber(), request.getDate(), jobIds, overallEnd);
        bookingStore.put(booking);

        // Save persistence for customer and involved mechanics
        jsonFileStorage.saveUser(customerId);
        for (String mId : involvedMechanics) {
            jsonFileStorage.saveUser(mId);
        }

        return mapToBookingResponse(booking, scheduledJobs);
    }

    public List<BookingResponse> getBookings(String customerId) {
        List<Booking> list = bookingStore.findByCustomerId(customerId);
        return list.stream().map(b -> {
            List<Job> jobs = b.getJobIds().stream()
                    .map(jobStore::findById)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            return mapToBookingResponse(b, jobs);
        }).collect(Collectors.toList());
    }

    private BookingResponse mapToBookingResponse(Booking booking, List<Job> jobs) {
        List<BookingResponse.JobItemResponse> jobItemResponses = new ArrayList<>();
        for (Job j : jobs) {
            Mechanic mech = j.getMechanicId() != null ? mechanicStore.findById(j.getMechanicId()) : null;
            String mechName = mech != null ? mech.getName() : "Unassigned";
            String workshopName = "Central Auto Care";
            if (mech != null && mech.getWorkshopId() != null) {
                Workshop ws = workshopStore.findById(mech.getWorkshopId());
                if (ws != null) workshopName = ws.getName();
            }

            jobItemResponses.add(new BookingResponse.JobItemResponse(
                    j.getJobId(),
                    j.getServiceItemId(),
                    j.getServiceName(),
                    j.getPrice(),
                    j.getExpectedMinutes(),
                    j.getQueueClass(),
                    j.getDate(),
                    j.getSlotStart(),
                    j.getEstimatedEnd(),
                    j.getMechanicId(),
                    mechName,
                    workshopName,
                    j.getStatus()
            ));
        }

        return new BookingResponse(
                booking.getBookingId(),
                booking.getCustomerId(),
                booking.getVehicleRegNo(),
                booking.getDate(),
                booking.getOverallEnd(),
                jobItemResponses
        );
    }
}
