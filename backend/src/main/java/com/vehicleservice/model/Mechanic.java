package com.vehicleservice.model;

import java.util.ArrayList;
import java.util.List;

public class Mechanic {
    private String id;
    private String name;
    private String email;
    private String workshopId;
    private List<Category> categories = new ArrayList<>();

    public Mechanic() {}

    public Mechanic(String id, String name, String email, String workshopId, List<Category> categories) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.workshopId = workshopId;
        this.categories = categories != null ? categories : new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWorkshopId() {
        return workshopId;
    }

    public void setWorkshopId(String workshopId) {
        this.workshopId = workshopId;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }
}
