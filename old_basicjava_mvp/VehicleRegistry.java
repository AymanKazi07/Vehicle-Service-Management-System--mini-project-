    import java.time.LocalDate;
    import java.util.Objects;
    import java.util.Optional;
    import java.util.concurrent.ConcurrentHashMap;


    public class VehicleRegistry {

        private final ConcurrentHashMap<String, Vehicle> vehicles;

        public VehicleRegistry() {
            this.vehicles = new ConcurrentHashMap<>();
        }

    
        public VehicleRegistry(int expectedVehicles) {
            this.vehicles = new ConcurrentHashMap<>(expectedVehicles);
        }

    
        public boolean registerVehicle(Vehicle vehicle) {
            Objects.requireNonNull(vehicle, "vehicle must not be null");
            return vehicles.putIfAbsent(vehicle.getPlateNumber(), vehicle) == null;
        }

    
        public Optional<Vehicle> getVehicleDetails(String plateNumber) {
            String key = Vehicle.normalizePlate(plateNumber);
            return key == null ? Optional.empty() : Optional.ofNullable(vehicles.get(key));
        }

        public boolean containsVehicle(String plateNumber) {
            String key = Vehicle.normalizePlate(plateNumber);
            return key != null && vehicles.containsKey(key);
        }

        public boolean updateVehicleDetails(String plateNumber, String newOwner,
                                            String newMobile, VehicleType newType) {
            String key = Vehicle.normalizePlate(plateNumber);
            if (key == null) return false;

            if (newOwner != null)  Vehicle.validateOwnerName(newOwner);
            if (newMobile != null) Vehicle.validateMobile(newMobile);

            return vehicles.computeIfPresent(key, (k, v) -> {
                if (newOwner != null)  v.setOwnerName(newOwner);
                if (newMobile != null) v.setMobileNumber(newMobile);
                if (newType != null)   v.setVehicleType(newType);
                return v;
            }) != null;
        }

        public boolean updateServiceDate(String plateNumber, LocalDate newDate) {
            String key = Vehicle.normalizePlate(plateNumber);
            if (key == null) return false;
            return vehicles.computeIfPresent(key, (k, v) -> {
                v.setServiceOrderDate(newDate);
                return v;
            }) != null;
        }

        public boolean addServiceRecord(String plateNumber, String record) {
            Optional<Vehicle> found = getVehicleDetails(plateNumber);
            found.ifPresent(v -> v.addServiceRecord(record));
            return found.isPresent();
        }

        public Optional<Vehicle> removeVehicle(String plateNumber) {
            String key = Vehicle.normalizePlate(plateNumber);
            return key == null ? Optional.empty() : Optional.ofNullable(vehicles.remove(key));
        }

        public int size() {
            return vehicles.size();
        }
    }
