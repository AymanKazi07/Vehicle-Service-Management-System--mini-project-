package com.vehicleservice.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Slot {
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean booked;
    private String jobId;
    private String mechanicId;

    public Slot() {}

    public Slot(LocalDate date, LocalTime startTime, LocalTime endTime, boolean booked, String jobId, String mechanicId) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.booked = booked;
        this.jobId = jobId;
        this.mechanicId = mechanicId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public boolean isBooked() {
        return booked;
    }

    public void setBooked(boolean booked) {
        this.booked = booked;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getMechanicId() {
        return mechanicId;
    }

    public void setMechanicId(String mechanicId) {
        this.mechanicId = mechanicId;
    }
}
