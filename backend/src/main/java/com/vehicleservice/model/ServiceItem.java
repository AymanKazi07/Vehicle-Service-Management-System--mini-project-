package com.vehicleservice.model;

public class ServiceItem {
    private String id;
    private String name;
    private Double price;
    private Integer expectedMinutes;
    private QueueClass queueClass;

    public ServiceItem() {}

    public ServiceItem(String id, String name, Double price, Integer expectedMinutes, QueueClass queueClass) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.expectedMinutes = expectedMinutes;
        this.queueClass = queueClass;
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
}
