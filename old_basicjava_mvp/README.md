# Vehicle Service Management System (DSA Mini-Project)

A role-based, data structure-grounded vehicle service workshop management platform featuring a Core Java 8 engine with file-based persistence alongside an interactive HTML/CSS/JavaScript web interface.

---

## 🏗️ Core Data Structures & Architectural Justification

1. **Custom Hash Table (`CustomHashTable.java`) [Key: Vehicle Registration Number]**
   - **Mechanism:** Implements custom separate chaining collision resolution using an array of `LinkedList<HashNode>`.
   - **Justification:** Enables $O(1)$ constant time lookup for vehicle verification during customer login and registration without sequential scanning.
2. **First-In-First-Out Queue (`pending_queue.dat` / `Queue<ServiceJob>`)**
   - **Mechanism:** `java.util.Queue` implemented via `LinkedList`.
   - **Justification:** Guarantees fair workshop dispatching; mechanics pull jobs strictly in the chronological order customers booked them.
3. **Last-In-First-Out Stack (`history_stacks.dat` / `Map<String, Stack<ServiceJob>>`)**
   - **Mechanism:** Individual `Stack<ServiceJob>` for each vehicle registration key.
   - **Justification:** Mechanics and vehicle owners inspect the most recent repairs at the top ($O(1)$ peek) without traversing entire vehicle timelines.
4. **Binary Object Serialization (`DatabaseManager.java`)**
   - **Mechanism:** Java native serialization saving states to `.dat` files (`users_hashtable.dat`, `pending_queue.dat`, `history_stacks.dat`).

---

## 👥 Three Role-Based Workflows

### Role 1: Customer Portal
- Authenticates using **Vehicle Number** and **Password** against the custom Hash Table.
- If not found, prompts the user to register their details (stored in database).
- Books appointment packages and reviews historical maintenance records in LIFO stack order.

### Role 2: Mechanic / Service Technician Bay
- Inspects pending jobs directly at the head of the FIFO Queue.
- Checks the vehicle's most recent repair history before servicing.
- Submits work completion notes, updates status to `COMPLETED`, and pushes the job record to the vehicle's history stack.

### Role 3: Workshop Administrator
- Verifies admin credentials (`admin123`).
- Generates end-of-day audit statistics: fleet size, pending order count, completed counts, workshop efficiency percentage, and package demand distribution.

---

## 🚀 Running the Project

### Core Java Console Engine:
```bash
# Navigate to project root directory
cd VehicleServiceFullStack

# Compile all source files
javac -d bin src/*.java

# Run the console system
java -cp bin src.ServicePortalConsole
```

### Web Frontend:
1. Open the `web/index.html` file in any modern web browser (Google Chrome, Firefox, Safari, Edge).
2. Switch between Customer, Mechanic, and Admin portals using the top navigation bar.
