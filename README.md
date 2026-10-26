# AutoServe: Vehicle Service Booking & Tracking System

A full-stack vehicle service booking and maintenance tracking system built with **Spring Boot 3 (Java 17)** and **React (Vite)** adhering to the PRD and Architecture specifications.

---

## 1. System Architecture

```
BROWSER (React, port 5173)
  pages/*Page.jsx
     |  uses components/*.jsx, reads AuthContext
     v
  api/*Api.js  -->  api/axiosClient.js  (adds Authorization: Bearer <JWT>)
     |  HTTP + JSON   (http://localhost:8080/api/...)
     v
SPRING BOOT (port 8080)
  config/JwtAuthFilter  -->  config/SecurityConfig   (checks token + role)
     v
  controller/*Controller      (receives DTOs, returns DTOs)
     v
  service/*Service            (business rules)
     |----> service/SchedulerService --> scheduler/SlotAllocator
     |                               --> store/JobStore (shortQueue, longQueue)
     |----> service/BillingService   --> GST 18%
     v
  store/*Store                (Java Collections: maps, stacks, queues)
     v
  store/JsonFileStorage       (data/users/<id>.json, data/workshops.json, data/catalog.json)
```

---

## 2. Key Technical Highlights

1. **In-Memory Java Collections & Zero Database**:
   - `ConcurrentHashMap` for shared user, vehicle, mechanic, and booking indexes.
   - 3-Layer Vehicle Hashing: `Map<String customerId, VehicleTree>` -> `Map<Category, Map<SubType, List<Vehicle>>>` -> `Vehicle` with secondary O(1) registration number index.
   - `Stack<ServiceRecord>` per vehicle: LIFO maintenance history (top = latest).
   - `TreeMap<LocalDate, List<Slot>>` per mechanic: 9:00 to 18:00 one-hour slot scheduling.
   - Two `PriorityBlockingQueue<Job>`:
     - **Short Queue** (duration <= 120 min): Ordered by appointment date, then shortest duration, then booking time.
     - **Long Queue** (duration > 120 min): Ordered by appointment date, then booking time (FCFS).
   - **Aging Task Starvation Guard**: Promotes long jobs waiting > 2 days to prevent starvation.

2. **Atomic JSON File Persistence**:
   - Files stored under `data/users/<userId>.json`, `data/workshops.json`, and `data/catalog.json`.
   - Thread-safe with one `ReentrantLock` per user file and atomic temp-file-then-rename writes (`.tmp` -> `.json`).
   - Auto-rebuilds priority queues on startup from pending jobs.

3. **Multi-Job Splitting & Slot Allocation**:
   - Split each booking into separate `Job` items.
   - Matches mechanics based on vehicle category capability.
   - Short jobs allocate consecutive 1-hour slots; long jobs reserve whole working days.
   - Calculates individual job completion and `overallEnd` (latest job finish time).

4. **18% Flat GST Billing**:
   - Automatically triggered when all jobs of a booking reach `COMPLETED` status.
   - Calculates itemised bill lines, subtotal, 18% GST amount, and grand total.
   - Pushes a `ServiceRecord` snapshot onto the vehicle's history stack.

---

## 3. Seed Accounts & Credentials

The system seeds the following default accounts and data automatically on first launch:

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@vehicleservice.com` | `admin123` | Can manage workshops, mechanics, view all bookings |
| **Mechanic 1** | `rajesh@vehicleservice.com` | `mech123` | Specializes in `TWO_WHEELER`, `THREE_WHEELER` |
| **Mechanic 2** | `amit@vehicleservice.com` | `mech123` | Specializes in `FOUR_WHEELER`, `HEAVY` |
| **Default Workshop** | ID: `ws-1` | N/A | Central Auto Care (123 Main Street, Sector 5) |

*Customers can sign up directly through the Auth page or use the API.*

---

## 4. How to Run the Application

### Prerequisites
- Java 17+
- Node.js (v18+) and npm
- Maven 3.8+ (or use the installed binary at `%LOCALAPPDATA%\Programs\apache-maven-3.9.6\bin\mvn.cmd`)

### Step 1: Start the Backend (Port 8080)
```powershell
cd backend
mvn clean spring-boot:run
```
*The Spring Boot server will initialize in-memory stores, seed initial data into `data/`, and listen on `http://localhost:8080`.*

### Step 2: Start the Frontend (Port 5173)
```powershell
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 5. Running the Backend Tests

The project includes full unit tests covering authentication, vehicle tree layered hashing, secondary O(1) index, 2-queue comparator ordering, aging starvation guard, and 18% GST billing:

```powershell
cd backend
mvn test
```

### Test Suites Included:
- `AuthAndVehicleTests`: Signup, login, vehicle tree layered hashing, and LIFO history stack.
- `BookingAndSchedulerTests`: Catalog lookups, multi-job booking splitting, slot allocations, and queue entry.
- `MechanicAdminBillingTests`: Workshop/mechanic admin flows, forward-only status transitions (`PENDING` -> `IN_PROGRESS` -> `COMPLETED`), and automated 18% GST billing.
- `SchedulerQueuesHashingBillingComprehensiveTests`: Short job comparator, long job comparator, aging starvation task, 3-layer hash verification, and bill calculation precision.
