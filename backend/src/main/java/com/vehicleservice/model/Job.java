package com.vehicleservice.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class Job {
    private String jobId;
    private String bookingId;
    private String customerId;
    private String vehicleRegNo;
    private String serviceItemId;
    private String serviceName;
    private Double price;
    private Integer expectedMinutes;
    private QueueClass queueClass;
    private LocalDate date;
    private LocalTime slotStart;
    private String mechanicId;
    private JobStatus status = JobStatus.PENDING;
    private LocalTime estimatedEnd;
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Job() {}

    public Job(String jobId, String bookingId, String customerId, String vehicleRegNo, String serviceItemId,
               String serviceName, Double price, Integer expectedMinutes, QueueClass queueClass, LocalDate date,
               LocalTime slotStart, String mechanicId, JobStatus status, LocalTime estimatedEnd) {
        this.jobId = jobId;
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.vehicleRegNo = vehicleRegNo;
        this.serviceItemId = serviceItemId;
        this.serviceName = serviceName;
        this.price = price;
        this.expectedMinutes = expectedMinutes;
        this.queueClass = queueClass;
        this.date = date;
        this.slotStart = slotStart;
        this.mechanicId = mechanicId;
        this.status = status != null ? status : JobStatus.PENDING;
        this.estimatedEnd = estimatedEnd;
        this.createdAt = LocalDateTime.now();
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getVehicleRegNo() {
        return vehicleRegNo;
    }

    public void setVehicleRegNo(String vehicleRegNo) {
        this.vehicleRegNo = vehicleRegNo;
    }

    public String getServiceItemId() {
        return serviceItemId;
    }

    public void setServiceItemId(String serviceItemId) {
        this.serviceItemId = serviceItemId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getExpectedMinutes() {
        return expectedMinutes;
    }

    public void setExpectedMinutes(Integer expectedMinutes) {
        this.expectedMinutes = expectedMinutes;
    }

    public QueueClass getQueueClass() {
        return queueClass;
    }

    public void setQueueClass(QueueClass queueClass) {
        this.queueClass = queueClass;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getSlotStart() {
        return slotStart;
    }

    public void setSlotStart(LocalTime slotStart) {
        this.slotStart = slotStart;
    }

    public String getMechanicId() {
        return mechanicId;
    }

    public void setMechanicId(String mechanicId) {
        this.mechanicId = mechanicId;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalTime getEstimatedEnd() {
        return estimatedEnd;
    }

    public void setEstimatedEnd(LocalTime estimatedEnd) {
        this.estimatedEnd = estimatedEnd;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
