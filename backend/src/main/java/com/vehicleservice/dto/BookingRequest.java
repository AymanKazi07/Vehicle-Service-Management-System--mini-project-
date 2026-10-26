package com.vehicleservice.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class BookingRequest {
    @NotNull(message = "Vehicle registration number is required")
    private String vehicleRegNo;

    @NotNull(message = "Booking date is required")
    private LocalDate date;

    @NotEmpty(message = "At least one service must be selected")
    private List<String> serviceItemIds;

    public BookingRequest() {}

    public BookingRequest(String vehicleRegNo, LocalDate date, List<String> serviceItemIds) {
        this.vehicleRegNo = vehicleRegNo;
        this.date = date;
        this.serviceItemIds = serviceItemIds;
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

    public List<String> getServiceItemIds() {
        return serviceItemIds;
    }

    public void setServiceItemIds(List<String> serviceItemIds) {
        this.serviceItemIds = serviceItemIds;
    }
}
