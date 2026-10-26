package com.vehicleservice.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class Booking {
    private String bookingId;
    private String customerId;
    private String vehicleRegNo;
    private LocalDate date;
    private List<String> jobIds = new ArrayList<>();
    private LocalTime overallEnd;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Booking() {}

    public Booking(String bookingId, String customerId, String vehicleRegNo, LocalDate date,
                   List<String> jobIds, LocalTime overallEnd) {
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.vehicleRegNo = vehicleRegNo;
        this.date = date;
        this.jobIds = jobIds != null ? jobIds : new ArrayList<>();
        this.overallEnd = overallEnd;
        this.createdAt = LocalDateTime.now();
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<String> getJobIds() {
        return jobIds;
    }

    public void setJobIds(List<String> jobIds) {
        this.jobIds = jobIds;
    }

    public LocalTime getOverallEnd() {
        return overallEnd;
    }

    public void setOverallEnd(LocalTime overallEnd) {
        this.overallEnd = overallEnd;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
