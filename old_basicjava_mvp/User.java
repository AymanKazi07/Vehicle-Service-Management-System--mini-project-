package src;

import java.io.Serializable;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String vehicleNumber;
    private String password;
    private String ownerName;
    private String phone;
    private String vehicleModel;

    public User(String vehicleNumber, String password, String ownerName, String phone, String vehicleModel) {
        this.vehicleNumber = vehicleNumber;
        this.password = password;
        this.ownerName = ownerName;
        this.phone = phone;
        this.vehicleModel = vehicleModel;
    }

    public String getVehicleNumber() { return vehicleNumber; }
    public String getPassword() { return password; }
    public String getOwnerName() { return ownerName; }
    public String getPhone() { return phone; }
    public String getVehicleModel() { return vehicleModel; }

    @Override
    public String toString() {
        return "Owner: " + ownerName + " | Phone: " + phone + " | Model: " + vehicleModel + " [" + vehicleNumber + "]";
    }
}
