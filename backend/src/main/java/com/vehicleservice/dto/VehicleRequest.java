package com.vehicleservice.dto;

import com.vehicleservice.model.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VehicleRequest {
    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotBlank(message = "Owner name is required")
    private String ownerName;

    @NotBlank(message = "Model name is required")
    private String modelName;

    @NotNull(message = "Category is required")
    private Category category;

    @NotBlank(message = "Sub-type is required")
    private String subType;

    public VehicleRequest() {}

    public VehicleRequest(String registrationNumber, String ownerName, String modelName, Category category, String subType) {
        this.registrationNumber = registrationNumber;
        this.ownerName = ownerName;
        this.modelName = modelName;
        this.category = category;
        this.subType = subType;
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
}
