package com.vehicleservice.dto;

import com.vehicleservice.model.JobStatus;
import jakarta.validation.constraints.NotNull;

public class JobStatusRequest {
    @NotNull(message = "Job status is required")
    private JobStatus status;

    private String notes;

    public JobStatusRequest() {}

    public JobStatusRequest(JobStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
