package com.vehicleservice.model;

import java.util.Stack;

public class Vehicle {
    private String registrationNumber;
    private String ownerName;
    private String modelName;
    private Category category;
    private String subType;
    private Stack<ServiceRecord> serviceHistory = new Stack<>();

    public Vehicle() {}

    public Vehicle(String registrationNumber, String ownerName, String modelName, Category category, String subType) {
        this.registrationNumber = registrationNumber;
        this.ownerName = ownerName;
        this.modelName = modelName;
        this.category = category;
        this.subType = subType;
        this.serviceHistory = new Stack<>();
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getSubType() {
        return subType;
    }

    public void setSubType(String subType) {
        this.subType = subType;
    }

    public Stack<ServiceRecord> getServiceHistory() {
        return serviceHistory;
    }

    public void setServiceHistory(Stack<ServiceRecord> serviceHistory) {
        this.serviceHistory = serviceHistory;
    }
}
