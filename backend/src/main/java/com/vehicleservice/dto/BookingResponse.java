package com.vehicleservice.dto;

import com.vehicleservice.model.JobStatus;
import com.vehicleservice.model.QueueClass;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class BookingResponse {
    private String bookingId;
    private String customerId;
    private String vehicleRegNo;
    private LocalDate date;
    private LocalTime overallEnd;
    private List<JobItemResponse> jobs = new ArrayList<>();

    public BookingResponse() {}

    public BookingResponse(String bookingId, String customerId, String vehicleRegNo, LocalDate date,
                           LocalTime overallEnd, List<JobItemResponse> jobs) {
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.vehicleRegNo = vehicleRegNo;
        this.date = date;
        this.overallEnd = overallEnd;
        this.jobs = jobs != null ? jobs : new ArrayList<>();
    }

    public static class JobItemResponse {
        private String jobId;
        private String serviceItemId;
        private String serviceName;
        private Double price;
        private Integer expectedMinutes;
        private QueueClass queueClass;
        private LocalDate date;
        private LocalTime slotStart;
        private LocalTime estimatedEnd;
        private String mechanicId;
        private String mechanicName;
        private String workshopName;
        private JobStatus status;

        public JobItemResponse() {}

        public JobItemResponse(String jobId, String serviceItemId, String serviceName, Double price,
                               Integer expectedMinutes, QueueClass queueClass, LocalDate date,
                               LocalTime slotStart, LocalTime estimatedEnd, String mechanicId,
                               String mechanicName, String workshopName, JobStatus status) {
            this.jobId = jobId;
            this.serviceItemId = serviceItemId;
            this.serviceName = serviceName;
            this.price = price;
            this.expectedMinutes = expectedMinutes;
            this.queueClass = queueClass;
            this.date = date;
            this.slotStart = slotStart;
            this.estimatedEnd = estimatedEnd;
            this.mechanicId = mechanicId;
            this.mechanicName = mechanicName;
            this.workshopName = workshopName;
            this.status = status;
        }

        public String getJobId() {
            return jobId;
        }

        public void setJobId(String jobId) {
            this.jobId = jobId;
        }

        public String getServiceItemId() {
            return serviceItemId;
        }

        public void setServiceItemId(String serviceItemId) {
            this.serviceItemId = serviceItemId;
        }

        public String getServiceName() {
            return serviceName;
        }

        public void setServiceName(String serviceName) {
            this.serviceName = serviceName;
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

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public LocalTime getSlotStart() {
            return slotStart;
        }

        public void setSlotStart(LocalTime slotStart) {
            this.slotStart = slotStart;
        }

        public LocalTime getEstimatedEnd() {
            return estimatedEnd;
        }

        public void setEstimatedEnd(LocalTime estimatedEnd) {
            this.estimatedEnd = estimatedEnd;
        }

        public String getMechanicId() {
            return mechanicId;
        }

        public void setMechanicId(String mechanicId) {
            this.mechanicId = mechanicId;
        }

        public String getMechanicName() {
            return mechanicName;
        }

        public void setMechanicName(String mechanicName) {
            this.mechanicName = mechanicName;
        }

        public String getWorkshopName() {
            return workshopName;
        }

        public void setWorkshopName(String workshopName) {
            this.workshopName = workshopName;
        }

        public JobStatus getStatus() {
            return status;
        }

        public void setStatus(JobStatus status) {
            this.status = status;
        }
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

    public LocalTime getOverallEnd() {
        return overallEnd;
    }

    public void setOverallEnd(LocalTime overallEnd) {
        this.overallEnd = overallEnd;
    }

    public List<JobItemResponse> getJobs() {
        return jobs;
    }

    public void setJobs(List<JobItemResponse> jobs) {
        this.jobs = jobs;
    }
}
