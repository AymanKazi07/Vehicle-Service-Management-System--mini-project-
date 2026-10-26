package com.vehicleservice.dto;

import com.vehicleservice.model.BillLine;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BillResponse {
    private String billId;
    private String bookingId;
    private LocalDate date;
    private String vehicleRegNo;
    private String ownerName;
    private String workshopName;
    private List<BillLine> lines = new ArrayList<>();
    private Double subtotal;
    private Double gstRate;
    private Double gstAmount;
    private Double grandTotal;

    public BillResponse() {}

    public BillResponse(String billId, String bookingId, LocalDate date, String vehicleRegNo,
                        String ownerName, String workshopName, List<BillLine> lines,
                        Double subtotal, Double gstRate, Double gstAmount, Double grandTotal) {
        this.billId = billId;
        this.bookingId = bookingId;
        this.date = date;
        this.vehicleRegNo = vehicleRegNo;
        this.ownerName = ownerName;
        this.workshopName = workshopName;
        this.lines = lines != null ? lines : new ArrayList<>();
        this.subtotal = subtotal;
        this.gstRate = gstRate;
        this.gstAmount = gstAmount;
        this.grandTotal = grandTotal;
    }

    public String getBillId() {
        return billId;
    }

    public void setBillId(String billId) {
        this.billId = billId;
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

    public String getVehicleRegNo() {
        return vehicleRegNo;
    }

    public void setVehicleRegNo(String vehicleRegNo) {
        this.vehicleRegNo = vehicleRegNo;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getWorkshopName() {
        return workshopName;
    }

    public void setWorkshopName(String workshopName) {
        this.workshopName = workshopName;
    }

    public List<BillLine> getLines() {
        return lines;
    }

    public void setLines(List<BillLine> lines) {
        this.lines = lines;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getGstRate() {
        return gstRate;
    }

    public void setGstRate(Double gstRate) {
        this.gstRate = gstRate;
    }

    public Double getGstAmount() {
        return gstAmount;
    }

    public void setGstAmount(Double gstAmount) {
        this.gstAmount = gstAmount;
    }

    public Double getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(Double grandTotal) {
        this.grandTotal = grandTotal;
    }
}
