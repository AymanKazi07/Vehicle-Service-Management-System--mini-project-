package com.vehicleservice.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ServiceRecord {
    private String bookingId;
    private LocalDate date;
    private List<String> services = new ArrayList<>();
    private List<String> mechanicNames = new ArrayList<>();
    private String workshopName;
    private Double subtotal;
    private Double gst;
    private Double total;

    public ServiceRecord() {}

    public ServiceRecord(String bookingId, LocalDate date, List<String> services, List<String> mechanicNames,
                         String workshopName, Double subtotal, Double gst, Double total) {
        this.bookingId = bookingId;
        this.date = date;
        this.services = services;
        this.mechanicNames = mechanicNames;
        this.workshopName = workshopName;
        this.subtotal = subtotal;
        this.gst = gst;
        this.total = total;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    public List<String> getMechanicNames() {
        return mechanicNames;
    }

    public void setMechanicNames(List<String> mechanicNames) {
        this.mechanicNames = mechanicNames;
    }

    public String getWorkshopName() {
        return workshopName;
    }

    public void setWorkshopName(String workshopName) {
        this.workshopName = workshopName;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getGst() {
        return gst;
    }

    public void setGst(Double gst) {
        this.gst = gst;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
