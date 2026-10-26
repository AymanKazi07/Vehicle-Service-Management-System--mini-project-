import java.time.LocalDate;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

public class Vehicle {

    private static final String MOBILE_REGEX = "\\d{10}";

    private final String plateNumber;
    private String ownerName;
    private String mobileNumber;
    private VehicleType vehicleType;
    private LocalDate serviceOrderDate;           
    private final Deque<String> serviceHistory = new ArrayDeque<>();

    public Vehicle(String plateNumber, String ownerName, String mobileNumber,
                   VehicleType vehicleType, LocalDate serviceOrderDate) {

        String normalized = normalizePlate(plateNumber);
        if (normalized == null) {
            throw new IllegalArgumentException("Plate number cannot be blank");
        }
        validateOwnerName(ownerName);
        validateMobile(mobileNumber);
        if (vehicleType == null) {
            throw new IllegalArgumentException("Vehicle type cannot be null");
        }

        this.plateNumber = normalized;
        this.ownerName = ownerName.trim();
        this.mobileNumber = mobileNumber;
        this.vehicleType = vehicleType;
        this.serviceOrderDate = serviceOrderDate;
    }


    public static void validateOwnerName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Owner name cannot be blank");
        }
    }

    public static void validateMobile(String mobile) {
        if (mobile == null || !mobile.matches(MOBILE_REGEX)) {
            throw new IllegalArgumentException("Invalid mobile number: must be exactly 10 digits");
        }
    }

    public static String normalizePlate(String raw) {
        if (raw == null) return null;
        String cleaned = raw.replaceAll("\\s+|-", "").toUpperCase(Locale.ROOT);
        return cleaned.isEmpty() ? null : cleaned;
    }

    public String getPlateNumber()          { return plateNumber; }
    public String getOwnerName()            { return ownerName; }
    public String getMobileNumber()         { return mobileNumber; }
    public VehicleType getVehicleType()     { return vehicleType; }
    public LocalDate getServiceOrderDate()  { return serviceOrderDate; }

    public void setOwnerName(String ownerName) {
        validateOwnerName(ownerName);
        this.ownerName = ownerName.trim();
    }

    public void setMobileNumber(String mobileNumber) {
        validateMobile(mobileNumber);
        this.mobileNumber = mobileNumber;
    }

    public void setVehicleType(VehicleType vehicleType) {
        this.vehicleType = Objects.requireNonNull(vehicleType, "Vehicle type cannot be null");
    }

    public void setServiceOrderDate(LocalDate serviceOrderDate) {
        this.serviceOrderDate = serviceOrderDate;
    }

    public void addServiceRecord(String record) {        
        serviceHistory.push(Objects.requireNonNull(record, "Record cannot be null"));
    }

    public String peekLatestService() {                   
        return serviceHistory.peek();
    }

    public List<String> getServiceHistory() {         
        return new ArrayList<>(serviceHistory);
    }

    @Override
    public String toString() {
        return "Vehicle [plateNumber=" + plateNumber + ", ownerName=" + ownerName
                + ", mobileNumber=" + mobileNumber + ", vehicleType=" + vehicleType
                + ", serviceOrderDate=" + serviceOrderDate
                + ", serviceHistorySize=" + serviceHistory.size() + "]";
    }
}