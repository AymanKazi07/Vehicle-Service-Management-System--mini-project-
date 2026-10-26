package com.vehicleservice.service;

import com.vehicleservice.config.AppProperties;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.*;
import com.vehicleservice.store.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class BillingService {
    private final BillStore billStore;
    private final BookingStore bookingStore;
    private final JobStore jobStore;
    private final VehicleStore vehicleStore;
    private final WorkshopStore workshopStore;
    private final MechanicStore mechanicStore;
    private final AppProperties appProperties;
    private final JsonFileStorage jsonFileStorage;

    public BillingService(BillStore billStore, BookingStore bookingStore, JobStore jobStore,
                          VehicleStore vehicleStore, WorkshopStore workshopStore, MechanicStore mechanicStore,
                          AppProperties appProperties, JsonFileStorage jsonFileStorage) {
        this.billStore = billStore;
        this.bookingStore = bookingStore;
        this.jobStore = jobStore;
        this.vehicleStore = vehicleStore;
        this.workshopStore = workshopStore;
        this.mechanicStore = mechanicStore;
        this.appProperties = appProperties;
        this.jsonFileStorage = jsonFileStorage;
    }

    public synchronized Bill generate(String bookingId) {
        Bill existing = billStore.findByBookingId(bookingId);
        if (existing != null) {
            return existing;
        }

        Booking booking = bookingStore.findById(bookingId);
        if (booking == null) {
            throw new ApiException("Booking not found: " + bookingId, HttpStatus.NOT_FOUND);
        }

        List<Job> jobs = new ArrayList<>();
        for (String jId : booking.getJobIds()) {
            Job j = jobStore.findById(jId);
            if (j == null) {
                throw new ApiException("Job record missing: " + jId, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (j.getStatus() != JobStatus.COMPLETED) {
                throw new ApiException("Cannot generate bill: Not all jobs are completed.");
            }
            jobs.add(j);
        }

        List<BillLine> lines = new ArrayList<>();
        double subtotal = 0.0;
        String workshopName = "Central Auto Care";

        List<String> serviceNames = new ArrayList<>();
        List<String> mechanicNames = new ArrayList<>();

        for (Job j : jobs) {
            Mechanic mech = j.getMechanicId() != null ? mechanicStore.findById(j.getMechanicId()) : null;
            String mechName = mech != null ? mech.getName() : "Assigned Mechanic";
            if (mech != null && mech.getWorkshopId() != null) {
                Workshop ws = workshopStore.findById(mech.getWorkshopId());
                if (ws != null) {
                    workshopName = ws.getName();
                }
            }

            double price = j.getPrice() != null ? j.getPrice() : 0.0;
            lines.add(new BillLine(j.getServiceName(), mechName, price));
            subtotal += price;

            serviceNames.add(j.getServiceName());
            if (!mechanicNames.contains(mechName)) {
                mechanicNames.add(mechName);
            }
        }

        double gstRate = appProperties.getGstRate();
        double gstAmount = Math.round(subtotal * gstRate * 100.0) / 100.0;
        double grandTotal = Math.round((subtotal + gstAmount) * 100.0) / 100.0;

        Vehicle vehicle = vehicleStore.findByRegistrationNumber(booking.getVehicleRegNo());
        String ownerName = vehicle != null ? vehicle.getOwnerName() : "Customer";

        String billId = "bill-" + UUID.randomUUID().toString().substring(0, 8);
        Bill bill = new Bill(billId, bookingId, LocalDate.now(), booking.getVehicleRegNo(), ownerName,
                workshopName, lines, subtotal, gstRate, gstAmount, grandTotal);

        billStore.put(bill);

        // Push ServiceRecord to vehicle's service history stack
        if (vehicle != null) {
            ServiceRecord record = new ServiceRecord(
                    bookingId,
                    LocalDate.now(),
                    serviceNames,
                    mechanicNames,
                    workshopName,
                    subtotal,
                    gstAmount,
                    grandTotal
            );
            vehicle.getServiceHistory().push(record);
        }

        // Save customer file with updated bill and service history
        jsonFileStorage.saveUser(booking.getCustomerId());

        return bill;
    }

    public Bill getBillByBookingId(String bookingId, User user) {
        Bill bill = billStore.findByBookingId(bookingId);
        if (bill == null) {
            throw new ApiException("Bill not found for booking " + bookingId, HttpStatus.NOT_FOUND);
        }

        Booking booking = bookingStore.findById(bookingId);
        if (user.getRole() == Role.CUSTOMER && booking != null) {
            if (!booking.getCustomerId().equals(user.getId())) {
                throw new ApiException("Access denied: You do not own this booking", HttpStatus.FORBIDDEN);
            }
        }

        return bill;
    }
}
