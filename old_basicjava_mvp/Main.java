import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Scanner;


public class Main {

    private static final Scanner sc = new Scanner(System.in);
    private static final VehicleRegistry registry = new VehicleRegistry();

    public static void main(String[] args) {
        System.out.println("=== Vehicle Service Management : Lookup Module ===");
        boolean running = true;

        while (running) {
            printMenu();
            String choice = ask("Choose an option: ").trim();
            try {
                switch (choice) {
                    case "1": registerVehicle();      break;
                    case "2": searchVehicle();        break;
                    case "3": updateDetails();        break;
                    case "4": updateServiceDate();    break;
                    case "5": addServiceRecord();     break;
                    case "6": removeVehicle();        break;
                    case "7": System.out.println("Registered vehicles: " + registry.size()); break;
                    case "0": running = false; System.out.println("Goodbye!"); break;
                    default:  System.out.println("Invalid option, please try again.");
                }
            } catch (IllegalArgumentException e) {          // validation errors from Vehicle / enum
                System.out.println("Error: " + e.getMessage());
            } catch (DateTimeParseException e) {
                System.out.println("Error: invalid date. Use the format yyyy-MM-dd (e.g. 2026-11-05).");
            }
        }
        sc.close();
    }


    private static void registerVehicle() {
        String plate  = ask("Plate number: ");
        String owner  = ask("Owner name: ");
        String mobile = ask("Mobile number (10 digits): ");
        VehicleType type = parseType(ask("Vehicle type " + Arrays.toString(VehicleType.values()) + ": "));
        LocalDate date = parseDate(ask("Service order date (yyyy-MM-dd, blank for none): "));

        Vehicle v = new Vehicle(plate, owner, mobile, type, date);   // validates everything
        if (registry.registerVehicle(v)) {
            System.out.println("Vehicle registered: " + v.getPlateNumber());
        } else {
            System.out.println("A vehicle with plate " + v.getPlateNumber() + " is already registered.");
        }
    }

    private static void searchVehicle() {
        Optional<Vehicle> found = registry.getVehicleDetails(ask("Plate number to search: "));
        if (found.isPresent()) {
            printVehicle(found.get());
        } else {
            System.out.println("Vehicle not found.");
        }
    }

    private static void updateDetails() {
        String plate = ask("Plate number to update: ");
        if (!registry.containsVehicle(plate)) {
            System.out.println("Vehicle not found.");
            return;
        }
        System.out.println("Leave a field blank to keep its current value.");
        String owner  = blankToNull(ask("New owner name: "));
        String mobile = blankToNull(ask("New mobile number: "));
        String typeIn = blankToNull(ask("New vehicle type " + Arrays.toString(VehicleType.values()) + ": "));
        VehicleType type = (typeIn == null) ? null : parseType(typeIn);

        boolean updated = registry.updateVehicleDetails(plate, owner, mobile, type);
        System.out.println(updated ? "Details updated." : "Vehicle not found.");
    }

    private static void updateServiceDate() {
        String plate = ask("Plate number: ");
        LocalDate date = parseDate(ask("New service order date (yyyy-MM-dd, blank to clear): "));
        boolean updated = registry.updateServiceDate(plate, date);
        System.out.println(updated ? "Service date updated." : "Vehicle not found.");
    }

    private static void addServiceRecord() {
        String plate = ask("Plate number: ");
        String record = ask("Service record (e.g. 2026-10-17 Oil change): ");
        if (record.isBlank()) {
            throw new IllegalArgumentException("Service record cannot be blank");
        }
        boolean added = registry.addServiceRecord(plate, record.trim());
        System.out.println(added ? "Service record added." : "Vehicle not found.");
    }

    private static void removeVehicle() {
        Optional<Vehicle> removed = registry.removeVehicle(ask("Plate number to remove: "));
        System.out.println(removed.isPresent()
                ? "Removed vehicle " + removed.get().getPlateNumber()
                : "Vehicle not found.");
    }

    private static void printMenu() {
        System.out.println();
        System.out.println("1. Register vehicle");
        System.out.println("2. Search vehicle by plate");
        System.out.println("3. Update owner / mobile / type");
        System.out.println("4. Update service date");
        System.out.println("5. Add service record");
        System.out.println("6. Remove vehicle");
        System.out.println("7. Show number of vehicles");
        System.out.println("0. Exit");
    }

    private static void printVehicle(Vehicle v) {
        System.out.println("--------------------------------");
        System.out.println("Plate      : " + v.getPlateNumber());
        System.out.println("Owner      : " + v.getOwnerName());
        System.out.println("Mobile     : " + v.getMobileNumber());
        System.out.println("Type       : " + v.getVehicleType());
        System.out.println("Service on : " + (v.getServiceOrderDate() == null ? "not scheduled" : v.getServiceOrderDate()));
        List<String> history = v.getServiceHistory();
        if (history.isEmpty()) {
            System.out.println("History    : none");
        } else {
            System.out.println("History (newest first):");
            for (String h : history) {
                System.out.println("  - " + h);
            }
        }
        System.out.println("--------------------------------");
    }

    private static String ask(String message) {
        System.out.print(message);
        return sc.nextLine();
    }

    private static String blankToNull(String s) {
        return s.isBlank() ? null : s.trim();
    }

    private static LocalDate parseDate(String s) {
        return s.isBlank() ? null : LocalDate.parse(s.trim());
    }

    private static VehicleType parseType(String s) {
        try {
            return VehicleType.valueOf(s.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Vehicle type must be one of " + Arrays.toString(VehicleType.values()));
        }
    }
}