package com.vehicleservice.service;

import com.vehicleservice.dto.JobStatusRequest;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.Booking;
import com.vehicleservice.model.Job;
import com.vehicleservice.model.JobStatus;
import com.vehicleservice.store.BookingStore;
import com.vehicleservice.store.JobStore;
import com.vehicleservice.store.JsonFileStorage;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MechanicService {
    private final JobStore jobStore;
    private final BookingStore bookingStore;
    private final BillingService billingService;
    private final JsonFileStorage jsonFileStorage;

    public MechanicService(JobStore jobStore, BookingStore bookingStore,
                           BillingService billingService, JsonFileStorage jsonFileStorage) {
        this.jobStore = jobStore;
        this.bookingStore = bookingStore;
        this.billingService = billingService;
        this.jsonFileStorage = jsonFileStorage;
    }

    public List<Job> getJobs(String mechanicId) {
        return jobStore.findAll().stream()
                .filter(j -> mechanicId.equals(j.getMechanicId()))
                .sorted(Comparator.comparing(Job::getDate).thenComparing(Job::getSlotStart, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }

    public synchronized Job updateStatus(String mechanicId, String jobId, JobStatusRequest request) {
        Job job = jobStore.findById(jobId);
        if (job == null) {
            throw new ApiException("Job not found with id: " + jobId, HttpStatus.NOT_FOUND);
        }

        if (!mechanicId.equals(job.getMechanicId())) {
            throw new ApiException("Unauthorized: You are not assigned to this job", HttpStatus.FORBIDDEN);
        }

        JobStatus current = job.getStatus();
        JobStatus next = request.getStatus();

        // Forward-only validation: PENDING -> IN_PROGRESS -> COMPLETED
        if (current == JobStatus.PENDING && next == JobStatus.IN_PROGRESS) {
            job.setStatus(JobStatus.IN_PROGRESS);
            // Remove from queue when in progress
            jobStore.getShortQueue().remove(job);
            jobStore.getLongQueue().remove(job);
        } else if (current == JobStatus.IN_PROGRESS && next == JobStatus.COMPLETED) {
            job.setStatus(JobStatus.COMPLETED);
        } else if (current == next) {
            // No state change, just updating notes
        } else {
            throw new ApiException("Invalid status transition: cannot move from " + current + " to " + next);
        }

        if (request.getNotes() != null) {
            job.setNotes(request.getNotes());
        }

        // If completed, check if all jobs for the booking are completed
        if (job.getStatus() == JobStatus.COMPLETED) {
            Booking booking = bookingStore.findById(job.getBookingId());
            if (booking != null) {
                boolean allCompleted = booking.getJobIds().stream()
                        .map(jobStore::findById)
                        .allMatch(j -> j != null && j.getStatus() == JobStatus.COMPLETED);

                if (allCompleted) {
                    billingService.generate(booking.getBookingId());
                }
            }
        }

        // Persist updates
        jsonFileStorage.saveUser(mechanicId);
        jsonFileStorage.saveUser(job.getCustomerId());

        return job;
    }
}
