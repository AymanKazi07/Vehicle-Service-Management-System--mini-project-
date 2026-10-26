package src;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ServiceJob implements Serializable {
    private static final long serialVersionUID = 1L;
    private String jobId;
    private String vehicleNumber;
    private String ownerName;
    private String serviceType;
    private Date bookingDate;
    private String status; // PENDING, IN_PROGRESS, COMPLETED
    private String remarks;

    public ServiceJob(String jobId, String vehicleNumber, String ownerName, String serviceType) {
        this.jobId = jobId;
        this.vehicleNumber = vehicleNumber;
        this.ownerName = ownerName;
        this.serviceType = serviceType;
        this.bookingDate = new Date();
        this.status = "PENDING";
        this.remarks = "Awaiting Bay Assignment";
    }

    public String getJobId() { return jobId; }
    public String getVehicleNumber() { return vehicleNumber; }
    public String getOwnerName() { return ownerName; }
    public String getServiceType() { return serviceType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Date getBookingDate() { return bookingDate; }

    @Override
    public String toString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        return "[" + jobId + "] " + vehicleNumber + " (" + ownerName + ") | " + serviceType 
                + " | Status: " + status + " | Notes: " + remarks + " | Booked: " + sdf.format(bookingDate);
    }
}
