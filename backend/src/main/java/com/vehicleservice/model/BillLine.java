package com.vehicleservice.model;

public class BillLine {
    private String service;
    private String mechanic;
    private Double price;

    public BillLine() {}

    public BillLine(String service, String mechanic, Double price) {
        this.service = service;
        this.mechanic = mechanic;
        this.price = price;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getMechanic() {
        return mechanic;
    }

    public void setMechanic(String mechanic) {
        this.mechanic = mechanic;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getServiceName() {
        return service;
    }

    public void setServiceName(String serviceName) {
        this.service = serviceName;
    }

    public String getMechanicName() {
        return mechanic;
    }

    public void setMechanicName(String mechanicName) {
        this.mechanic = mechanicName;
    }
}
