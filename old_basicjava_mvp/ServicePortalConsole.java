package src;

import java.text.SimpleDateFormat;
import java.util.*;

public class ServicePortalConsole {
    private static CustomHashTable userDirectory;
    private static Queue<ServiceJob> pendingQueue;
    private static Map<String, Stack<ServiceJob>> serviceHistory;
    private static Scanner sc = new Scanner(System.in);
    private static int jobCounter = 1000;

    public static void main(String[] args) {
        userDirectory = DatabaseManager.loadUsers();
        pendingQueue = DatabaseManager.loadPendingQueue();
        serviceHistory = DatabaseManager.loadHistory();

        seedSampleDataIfEmpty();

        boolean exit = false;
        while (!exit) {
            System.out.println("\n=======================================================");
            System.out.println("     VEHICLE SERVICE & WORKSHOP MANAGEMENT SYSTEM     ");
            System.out.println("=======================================================");
            System.out.println(" 1. Customer Login / Register");
            System.out.println(" 2. Mechanic / Technician Portal");
            System.out.println(" 3. Workshop Admin Portal");
            System.out.println(" 4. Save & Exit");
            System.out.println("-------------------------------------------------------");
            System.out.print("Select an option [1-4]: ");

            String input = sc.nextLine().trim();
            switch (input) {
                case "1": customerFlow(); break;
                case "2": mechanicFlow(); break;
                case "3": adminFlow(); break;
                case "4":
                    DatabaseManager.saveAll(userDirectory, pendingQueue, serviceHistory);
                    System.out.println("Persisting database state... Goodbye!");
                    exit = true;
                    break;
                default:
                    System.out.println("Invalid selection. Please try again.");
            }
        }
    }

    private static void customerFlow() {
        System.out.println("\n--- [ROLE 1: CUSTOMER ACCESS] ---");
        System.out.println("1. Login (Existing Customer)");
        System.out.println("2. Register New Vehicle & Account");
        System.out.print("Enter selection: ");
        String choice = sc.nextLine().trim();

        if (choice.equals("1")) {
            System.out.print("Enter Vehicle Registration Number: ");
            String regNo = sc.nextLine().trim().toUpperCase();
            System.out.print("Enter Password: ");
            String pwd = sc.nextLine().trim();

            User user = userDirectory.get(regNo);
            if (user == null) {
                System.out.println("\n[ERROR] No existing user found with vehicle number: " + regNo);
                System.out.println("Please register first using Option 2.");
                return;
            }

            if (!user.getPassword().equals(pwd)) {
                System.out.println("\n[ERROR] Invalid password. Access denied.");
                return;
            }

            System.out.println("\n>>> Login Successful! Welcome " + user.getOwnerName() + " (" + user.getVehicleModel() + ") <<<");
            customerDashboard(user);

        } else if (choice.equals("2")) {
            System.out.print("Enter Vehicle Registration Number: ");
            String regNo = sc.nextLine().trim().toUpperCase();

            if (userDirectory.containsKey(regNo)) {
                System.out.println("\n[NOTICE] Vehicle number already registered in database. Please log in.");
                return;
            }

            System.out.print("Enter Password: ");
            String pwd = sc.nextLine().trim();
            System.out.print("Enter Owner Full Name: ");
            String name = sc.nextLine().trim();
            System.out.print("Enter Contact Phone Number: ");
            String phone = sc.nextLine().trim();
            System.out.print("Enter Vehicle Model (e.g., Honda City, Hyundai Creta): ");
            String model = sc.nextLine().trim();

            User newUser = new User(regNo, pwd, name, phone, model);
            userDirectory.put(regNo, newUser);
            serviceHistory.putIfAbsent(regNo, new Stack<>());
            DatabaseManager.saveAll(userDirectory, pendingQueue, serviceHistory);

            System.out.println("\n[SUCCESS] Vehicle registered successfully in Hash Table! You can now log in.");
        }
    }

    private static void customerDashboard(User user) {
        boolean back = false;
        while (!back) {
            System.out.println("\n-- Customer Menu: " + user.getVehicleNumber() + " --");
            System.out.println("1. Book a Service Appointment");
            System.out.println("2. View Service History (Stack)");
            System.out.println("3. Back to Main Menu");
            System.out.print("Select: ");
            String op = sc.nextLine().trim();

            if (op.equals("1")) {
                System.out.println("\nSelect Service Package:");
                System.out.println(" - Periodic General Maintenance");
                System.out.println(" - Brake Pad Inspection & Replacement");
                System.out.println(" - Engine Diagnostics & Repair");
                System.out.println(" - Express Oil & Filter Change");
                System.out.print("Enter service type: ");
                String type = sc.nextLine().trim();

                String jobId = "JOB-" + (++jobCounter);
                ServiceJob job = new ServiceJob(jobId, user.getVehicleNumber(), user.getOwnerName(), type);
                pendingQueue.offer(job);
                DatabaseManager.saveAll(userDirectory, pendingQueue, serviceHistory);

                System.out.println("\n[SUCCESS] Appointment confirmed! Job Ticket: " + jobId);
                System.out.println("Your job has been queued in FIFO order for technicians.");
            } else if (op.equals("2")) {
                Stack<ServiceJob> history = serviceHistory.get(user.getVehicleNumber());
                if (history == null || history.isEmpty()) {
                    System.out.println("No past service records available for " + user.getVehicleNumber());
                } else {
                    System.out.println("\nPast Service History (Latest First - Stack LIFO):");
                    for (int i = history.size() - 1; i >= 0; i--) {
                        System.out.println("  * " + history.get(i));
                    }
                }
            } else {
                back = true;
            }
        }
    }

    private static void mechanicFlow() {
        System.out.println("\n--- [ROLE 2: MECHANIC / SERVICE CREW] ---");
        if (pendingQueue.isEmpty()) {
            System.out.println("No vehicles waiting in the pending queue right now.");
            return;
        }

        System.out.println("Total Jobs Currently in Pending Queue: " + pendingQueue.size());
        ServiceJob topJob = pendingQueue.peek();
        System.out.println("\nNext Job in Line: " + topJob);

        // Fetch vehicle history stack to assist diagnosis
        Stack<ServiceJob> history = serviceHistory.get(topJob.getVehicleNumber());
        if (history != null && !history.isEmpty()) {
            System.out.println(">>> Customer's Most Recent Repair (Stack Peek): " + history.peek().getServiceType() 
                    + " (" + history.peek().getStatus() + ") <<<");
        } else {
            System.out.println(">>> Vehicle has no prior repair history on file. <<<");
        }

        System.out.print("\nDo you want to accept and service this order? (yes/no): ");
        if (sc.nextLine().trim().equalsIgnoreCase("yes")) {
            ServiceJob activeJob = pendingQueue.poll();
            System.out.println("Servicing vehicle " + activeJob.getVehicleNumber() + "...");
            System.out.print("Enter completion notes/remarks: ");
            String notes = sc.nextLine().trim();

            activeJob.setStatus("COMPLETED");
            activeJob.setRemarks(notes.isEmpty() ? "Service completed successfully" : notes);

            // Push to Vehicle's History Stack
            Stack<ServiceJob> stack = serviceHistory.getOrDefault(activeJob.getVehicleNumber(), new Stack<>());
            stack.push(activeJob);
            serviceHistory.put(activeJob.getVehicleNumber(), stack);

            DatabaseManager.saveAll(userDirectory, pendingQueue, serviceHistory);
            System.out.println("\n[UPDATED] Job marked COMPLETED and archived to customer's history stack.");
        }
    }

    private static void adminFlow() {
        System.out.print("Enter Admin Security Passcode: ");
        String pass = sc.nextLine().trim();
        if (!pass.equals("admin123")) {
            System.out.println("[ACCESS DENIED] Incorrect passcode.");
            return;
        }

        System.out.println("\n=======================================================");
        System.out.println("             WORKSHOP END-OF-DAY AUDIT REPORT          ");
        System.out.println("=======================================================");

        int totalVehicles = userDirectory.getSize();
        int pendingCount = pendingQueue.size();
        int completedCount = 0;
        Map<String, Integer> serviceTypeStats = new HashMap<>();

        for (Stack<ServiceJob> stack : serviceHistory.values()) {
            completedCount += stack.size();
            for (ServiceJob job : stack) {
                serviceTypeStats.put(job.getServiceType(), serviceTypeStats.getOrDefault(job.getServiceType(), 0) + 1);
            }
        }

        System.out.println(" Total Registered Vehicles in Hash Table : " + totalVehicles);
        System.out.println(" Jobs Pending in FIFO Queue             : " + pendingCount);
        System.out.println(" Jobs Completed & Logged in Stacks      : " + completedCount);
        System.out.println(" Workshop Completion Rate               : " 
                + (completedCount + pendingCount > 0 ? (completedCount * 100 / (completedCount + pendingCount)) + "%" : "N/A"));

        System.out.println("\nPopular Service Demand Distribution:");
        if (serviceTypeStats.isEmpty()) {
            System.out.println(" - No completed jobs recorded yet.");
        } else {
            serviceTypeStats.forEach((type, count) -> System.out.println(" - " + type + ": " + count + " orders"));
        }

        System.out.print("\nLookup detailed history of specific vehicle (Enter reg no or press Enter to skip): ");
        String reg = sc.nextLine().trim().toUpperCase();
        if (!reg.isEmpty()) {
            User u = userDirectory.get(reg);
            if (u != null) {
                System.out.println("Vehicle Profile: " + u);
                Stack<ServiceJob> stack = serviceHistory.get(reg);
                if (stack == null || stack.isEmpty()) {
                    System.out.println("No past service jobs.");
                } else {
                    for (int i = stack.size() - 1; i >= 0; i--) {
                        System.out.println(" -> " + stack.get(i));
                    }
                }
            } else {
                System.out.println("Vehicle registration not found.");
            }
        }
    }

    private static void seedSampleDataIfEmpty() {
        if (userDirectory.getSize() == 0) {
            User u1 = new User("MH12AB1234", "pass1", "Aman Sharma", "9876543210", "Honda City");
            User u2 = new User("MH14CD5678", "pass2", "Priya Patil", "9823012345", "Tata Nexon");
            userDirectory.put(u1.getVehicleNumber(), u1);
            userDirectory.put(u2.getVehicleNumber(), u2);

            serviceHistory.put(u1.getVehicleNumber(), new Stack<>());
            serviceHistory.put(u2.getVehicleNumber(), new Stack<>());

            ServiceJob pastJob = new ServiceJob("JOB-999", u1.getVehicleNumber(), u1.getOwnerName(), "Brake Pad Inspection & Replacement");
            pastJob.setStatus("COMPLETED");
            pastJob.setRemarks("Front pads replaced with OEM parts");
            serviceHistory.get(u1.getVehicleNumber()).push(pastJob);

            ServiceJob pendingJob = new ServiceJob("JOB-1000", u2.getVehicleNumber(), u2.getOwnerName(), "Periodic General Maintenance");
            pendingQueue.offer(pendingJob);

            DatabaseManager.saveAll(userDirectory, pendingQueue, serviceHistory);
        }
    }
}
