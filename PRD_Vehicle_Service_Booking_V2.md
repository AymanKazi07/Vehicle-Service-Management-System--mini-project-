# PRD: Vehicle Service Booking & Tracking System (Version 2)

Oct 23, 2026

## 1. Overview

This system lets vehicle owners book service appointments by date and service type, lets mechanics update job status (Pending, In Progress, Completed), and keeps a service history per vehicle. Data is held in Java Collections at runtime and saved as one JSON file per user, in a Spring Boot backend with a React frontend.

**Goals**

- Online booking by date and service type, with auto-assigned slots and mechanics; one booking can hold several services handled by different mechanics.
- Per-customer vehicle tree (layered hashing) with a service-history stack per vehicle.
- Two priority queues that separate short jobs from long jobs.
- Itemised final bill with GST once all mechanics confirm completion.

**Non-goals (v1)**

- No relational database, online payments, SMS or email notifications. Data is stored as one JSON file per user.
- No multi-city or multi-language support.

**User roles**

| Role | What they do |
| --- | --- |
| Customer | Sign up, log in, view vehicles and history, book a service, view bill |
| Mechanic | See assigned jobs, update status and work done, confirm completion |
| Admin | Add mechanics and workshops, view all bookings |

## 2. Tech stack and architecture

A React single-page app calls a Spring Boot REST API; the API keeps every record in in-memory collections held by singleton service beans.

| Layer | Choice |
| --- | --- |
| Frontend | React, React Router, Axios |
| Backend | Spring Boot (Java 17+), Spring Web, Spring Security with JWT |
| Storage | Java Collections at runtime, JSON files on disk: `HashMap`, `ArrayList`, `Stack`, `PriorityQueue`, `TreeMap` |
| Passwords | BCrypt-hashed, stored in the user map |

**Backend packages:** `controller`, `service`, `model`, `repository` (collection-backed classes that replace a DB), `scheduler` (the two queues), `config`.

**Thread safety:** use `ConcurrentHashMap` for shared maps and `synchronized` or `PriorityBlockingQueue` for the queues, since Spring handles requests on many threads.

**Persistence:** each user is saved as one JSON file (`data/users/<customerId>.json`) holding the profile, vehicle tree and service stacks. All files load into the maps at startup, and a user's file is rewritten after every change. Write to a temp file, then rename, to avoid corrupt files.

## 3. Vehicle hierarchy and layered hashing

Each customer owns one `VehicleTree` object, found by hashing the customer ID; inside it, vehicles are hashed again by category, then by sub-type.

```
Vehicles
├── 2-Wheeler
│   ├── Geared
│   ├── Non-geared / Scooter
│   └── EV
├── 3-Wheeler
│   ├── CNG
│   └── Petrol
├── 4-Wheeler
│   ├── Petrol
│   ├── CNG
│   ├── Diesel
│   └── EV
└── Heavy Vehicles   (single sub-type: DEFAULT)
```

**Hash layers**

1. Layer 1: `Map<String customerId, VehicleTree>`
2. Layer 2: inside `VehicleTree`, `Map<Category, Map<SubType, List<Vehicle>>>`
3. Layer 3: `Vehicle` fields, one `Stack<ServiceRecord>` per vehicle

```java
enum Category { TWO_WHEELER, THREE_WHEELER, FOUR_WHEELER, HEAVY }

class Vehicle {
    String registrationNumber;
    String ownerName;
    String modelName;
    Stack<ServiceRecord> serviceHistory;   // top = latest service
}

class VehicleTree {
    Map<Category, Map<String, List<Vehicle>>> tree = new HashMap<>();
}

Map<String, VehicleTree> customerVehicles = new ConcurrentHashMap<>();
```

**Rules**

- Registration number is unique across the system; keep a secondary `Map<String, Vehicle>` for O(1) lookup by number.
- A completed job pushes a `ServiceRecord` onto the vehicle's stack; the dashboard reads the top for "last service" and iterates for full history.
- Lookup cost is O(1) per layer. In the JSON file, each stack is stored as an array with the latest record last, and is rebuilt into a Stack on load.

## 4. Service catalog

Each category and sub-type has its own list of services with a price (INR), expected duration (minutes) and a queue class. A service of 120 minutes or less goes to the Short queue; anything longer goes to the Long queue. Prices below are sample seed data; the admin can edit them.

| Category / sub-type | Service | Price (INR) | Duration (min) | Queue |
| --- | --- | --- | --- | --- |
| 2-Wheeler / Geared | General service | 600 | 90 | Short |
| 2-Wheeler / Geared | Oil change | 350 | 30 | Short |
| 2-Wheeler / Geared | Chain clean and lube | 250 | 30 | Short |
| 2-Wheeler / Geared | Brake pad replacement | 400 | 45 | Short |
| 2-Wheeler / Geared | Tyre replacement | 500 | 45 | Short |
| 2-Wheeler / Geared | Battery replacement | 300 | 30 | Short |
| 2-Wheeler / Geared | Clutch plate replacement | 900 | 120 | Short |
| 2-Wheeler / Geared | Engine overhaul | 6,000 | 480 | Long |
| 2-Wheeler / Geared | Full body painting | 5,000 | 720 | Long |
| 2-Wheeler / Scooter | General service | 500 | 75 | Short |
| 2-Wheeler / Scooter | Oil change | 300 | 30 | Short |
| 2-Wheeler / Scooter | Brake adjustment | 200 | 30 | Short |
| 2-Wheeler / Scooter | CVT belt replacement | 800 | 90 | Short |
| 2-Wheeler / Scooter | Throttle body cleaning | 400 | 60 | Short |
| 2-Wheeler / Scooter | Engine overhaul | 5,500 | 420 | Long |
| 2-Wheeler / Scooter | Full body painting | 4,500 | 720 | Long |
| 2-Wheeler / EV | Battery and motor check | 700 | 60 | Short |
| 2-Wheeler / EV | Charger and wiring inspection | 450 | 45 | Short |
| 2-Wheeler / EV | Brake service | 350 | 45 | Short |
| 2-Wheeler / EV | Software update and diagnostics | 500 | 30 | Short |
| 2-Wheeler / EV | Motor replacement | 15,000 | 480 | Long |
| 2-Wheeler / EV | Battery pack replacement | 25,000 | 360 | Long |
| 3-Wheeler / CNG | Gas kit inspection | 800 | 60 | Short |
| 3-Wheeler / CNG | Oil and filter change | 700 | 45 | Short |
| 3-Wheeler / CNG | Brake service | 600 | 60 | Short |
| 3-Wheeler / CNG | Cylinder hydro-test | 1,500 | 120 | Short |
| 3-Wheeler / CNG | Clutch replacement | 1,800 | 180 | Long |
| 3-Wheeler / CNG | Engine overhaul | 9,000 | 720 | Long |
| 3-Wheeler / Petrol | Engine tune-up | 1,200 | 120 | Short |
| 3-Wheeler / Petrol | Oil change | 400 | 30 | Short |
| 3-Wheeler / Petrol | Spark plug replacement | 250 | 30 | Short |
| 3-Wheeler / Petrol | Brake service | 600 | 60 | Short |
| 3-Wheeler / Petrol | Gearbox repair | 4,000 | 360 | Long |
| 3-Wheeler / Petrol | Full body painting | 8,000 | 1,440 | Long |
| 4-Wheeler / Petrol | Oil and filter change | 1,200 | 45 | Short |
| 4-Wheeler / Petrol | Battery replacement | 800 | 30 | Short |
| 4-Wheeler / Petrol | Wheel alignment and balancing | 1,000 | 60 | Short |
| 4-Wheeler / Petrol | Brake pad replacement | 1,800 | 90 | Short |
| 4-Wheeler / Petrol | AC service | 2,000 | 120 | Short |
| 4-Wheeler / Petrol | General service | 2,500 | 180 | Long |
| 4-Wheeler / Petrol | Clutch replacement | 6,000 | 300 | Long |
| 4-Wheeler / Petrol | Engine overhaul | 25,000 | 1,440 | Long |
| 4-Wheeler / CNG | CNG kit inspection | 1,000 | 60 | Short |
| 4-Wheeler / CNG | Oil and filter change | 1,300 | 45 | Short |
| 4-Wheeler / CNG | Regulator and injector cleaning | 1,500 | 90 | Short |
| 4-Wheeler / CNG | Cylinder hydro-test | 2,000 | 120 | Short |
| 4-Wheeler / CNG | General service | 2,800 | 180 | Long |
| 4-Wheeler / CNG | Engine overhaul | 28,000 | 1,440 | Long |
| 4-Wheeler / Diesel | Oil and filter change | 1,800 | 60 | Short |
| 4-Wheeler / Diesel | Fuel filter replacement | 1,200 | 60 | Short |
| 4-Wheeler / Diesel | General service | 3,000 | 180 | Long |
| 4-Wheeler / Diesel | Clutch replacement | 7,000 | 300 | Long |
| 4-Wheeler / Diesel | Turbocharger repair | 12,000 | 480 | Long |
| 4-Wheeler / Diesel | Engine replacement | 60,000 | 1,440 | Long |
| 4-Wheeler / EV | Battery diagnostics | 1,500 | 90 | Short |
| 4-Wheeler / EV | Brake service | 1,800 | 90 | Short |
| 4-Wheeler / EV | Coolant system service | 2,200 | 120 | Short |
| 4-Wheeler / EV | Charging port repair | 3,500 | 180 | Long |
| 4-Wheeler / EV | Battery pack replacement | 2,50,000 | 1,440 | Long |
| 4-Wheeler / any | Interior detailing | 3,000 | 180 | Long |
| 4-Wheeler / any | Dent and scratch repair | 6,000 | 480 | Long |
| 4-Wheeler / any | Full body painting | 25,000 | 2,880 | Long |
| Heavy | Oil and filter change | 3,500 | 90 | Short |
| Heavy | Tyre replacement | 12,000 | 120 | Short |
| Heavy | Air brake system service | 5,000 | 180 | Long |
| Heavy | General service | 6,000 | 240 | Long |
| Heavy | Brake relining | 8,000 | 360 | Long |
| Heavy | Chassis welding repair | 15,000 | 720 | Long |
| Heavy | Gearbox overhaul | 35,000 | 1,440 | Long |
| Heavy | Engine replacement | 1,20,000 | 2,880 | Long |

**Data structure:** `Map<Category, Map<SubType, List<ServiceItem>>>`, mirroring the vehicle tree. `ServiceItem` = `id`, `name`, `price`, `expectedMinutes`, `queueClass`.

The 120-minute threshold is a config value, not hard-coded.

## 5. Scheduling with two priority queues

Every service line in a booking becomes a `Job` and enters exactly one of two `PriorityQueue<Job>` instances, chosen by the service's queue class. A booking with several services is split into one Job per service, so each service is queued and assigned on its own.

| Queue | Holds | Ordering (comparator) |
| --- | --- | --- |
| Short-job queue | Quick services such as servicing and oil change | Appointment date, then shortest duration, then booking time |
| Long-job queue | Heavy work such as engine change and full body painting | Appointment date, then booking time (first come, first served) |

**Slot and mechanic allocation**

1. Working hours: 9:00 to 18:00, one-hour slots. Short jobs use consecutive slots; a long job reserves whole days.
2. Each mechanic has `TreeMap<LocalDate, List<Slot>>` for availability.
3. On booking, the scheduler picks the workshop mechanic with the earliest free slot on or after the chosen date. Mechanics should be matched to the vehicle category they handle. Each service in a booking is assigned separately, so one booking can use several mechanics; overall completion is the latest service end.
4. Estimated completion = slot start + expected duration. If the chosen date is full, the system offers the next available date.
5. Mechanics pull their next job from the Short queue first on normal days, and take a Long-queue job when it is due that day.

**Starvation guard:** a Long job waiting more than 2 days gets its priority raised so short jobs cannot block it forever.

**Job status:** `PENDING` (booked), `IN_PROGRESS`, `COMPLETED`. Only the assigned mechanic can change status, and only forward. Each service Job has its own status; the booking is Completed when all its Jobs are Completed.

## 6. Workflow and functional requirements

**End-to-end workflow**

1. The customer signs in.
2. The dashboard shows the customer's vehicles and service history.
3. The customer picks a vehicle, a date and a service type.
4. The system shows, for each selected service, the allocated slot, mechanic, workshop and estimated completion time, plus the overall finish time.
5. Each assigned mechanic moves their service to In Progress, then marks it Completed with work-done notes.
6. Once all services are Completed, the customer sees the final bill with GST.

**Functional requirements**

| ID | Requirement | Role | Priority |
| --- | --- | --- | --- |
| FR-1 | Sign up, log in, log out with JWT | Customer, Mechanic, Admin | Must |
| FR-2 | Add and view own vehicles (registration number, owner name, model, category, sub-type) | Customer | Must |
| FR-3 | View service history for each vehicle (latest first, from the stack) | Customer | Must |
| FR-4 | List services for the vehicle's category and sub-type with price and duration | Customer | Must |
| FR-5 | Book by date and services; one booking can hold several services | Customer | Must |
| FR-6 | Auto-allocate slot and mechanic per service (mechanics may differ); show estimated completion | System | Must |
| FR-7 | Route each job to the short or long queue | System | Must |
| FR-8 | View assigned jobs; update status and work-done notes | Mechanic | Must |
| FR-9 | Push a service record to the vehicle's stack on completion | System | Must |
| FR-10 | Generate and show the final bill with GST | Customer | Must |
| FR-11 | Add, edit, remove mechanics and workshops | Admin | Must |
| FR-12 | Edit the service catalog (price, duration) | Admin | Should |
| FR-13 | Cancel or reschedule a Pending booking | Customer | Should |

## 7. Frontend pages

Three pages, protected by a role-based route guard that reads the role from the JWT.

**Page 1: Login, Signup and Customer Dashboard** (`/auth`, `/dashboard`)

- Login and signup forms with validation.
- Vehicle cards: registration number, owner name, model, category and sub-type.
- Service history list per vehicle, latest first, with a status badge.
- Booking form: vehicle, date picker, service list with price and time, then a confirmation panel showing, for each service, the slot, mechanic, workshop and estimated completion.
- Bill view for completed jobs.

**Page 2: Mechanic** (`/mechanic`)

- Today's and upcoming jobs for this mechanic, each with vehicle number, service and expected time.
- Buttons to set Pending, In Progress or Completed (forward only).
- Work-done notes field and a Confirm completion action that triggers billing.

**Page 3: Admin** (`/admin`)

- Add workshop (name, address, contact).
- Add mechanic (name, login, workshop, vehicle categories handled).
- Tables of workshops, mechanics and all bookings.
- Service catalog editor (should-have).

## 8. Data model and REST APIs

**Core classes and their collections**

| Class | Key fields | Held in |
| --- | --- | --- |
| `User` | id, name, email, passwordHash, role | `Map<String, User>` |
| `Vehicle` | registrationNumber, ownerName, modelName, `Stack<ServiceRecord>` | `VehicleTree` (per customer) |
| `Workshop` | id, name, address, contact | `Map<String, Workshop>` |
| `Mechanic` | id, name, workshopId, categories, availability | `Map<String, Mechanic>` |
| `ServiceItem` | id, name, price, expectedMinutes, queueClass | catalog map |
| `Job` | id, vehicleNo, bookingId, serviceId, date, slot, mechanicId, status, estimatedEnd | two `PriorityQueue<Job>` + `Map<String, Job>` |
| `ServiceRecord` | bookingId, date, services with mechanic names, workshopName, subtotal, GST, total | vehicle's stack |
| `Bill` | billId, date, vehicleNo, ownerName, workshopName, line items (service, mechanic, price), subtotal, GST rate, GST amount, grand total | `Map<String, Bill>` |

**REST endpoints**

| Method and path | Role | Purpose |
| --- | --- | --- |
| `POST /api/auth/signup`, `POST /api/auth/login` | Public | Register, get JWT |
| `GET /api/vehicles` | Customer | List own vehicles |
| `POST /api/vehicles` | Customer | Add a vehicle |
| `GET /api/vehicles/{regNo}/history` | Customer | Service history (stack, latest first) |
| `GET /api/services?category=&subType=` | Customer | Service list for a vehicle type |
| `POST /api/bookings` | Customer | Book; returns slot, mechanic, estimate |
| `GET /api/bookings` | Customer | Own bookings |
| `GET /api/bills/{bookingId}` | Customer | Final bill |
| `GET /api/mechanic/jobs` | Mechanic | Assigned jobs |
| `PATCH /api/mechanic/jobs/{id}/status` | Mechanic | Set status and work notes |
| `POST /api/admin/workshops`, `GET /api/admin/workshops` | Admin | Manage workshops |
| `POST /api/admin/mechanics`, `GET /api/admin/mechanics` | Admin | Manage mechanics |
| `PUT /api/admin/services/{id}` | Admin | Edit catalog entry |

## 9. Final bill, non-functional needs, risks and milestones

**Final bill contents** (generated when the mechanic confirms completion)

- Bill number and date
- Vehicle registration number and owner name
- Mechanic name for each service; service centre (workshop) name and address
- Each service with its own price
- Subtotal, GST at a flat 18% on the whole bill, and grand total (subtotal + GST)

**Non-functional requirements**

- Booking and history endpoints respond in under 300 ms with up to 10,000 vehicles in memory.
- Passwords BCrypt-hashed; role checks enforced on the server, not just in React.
- A customer can only read their own vehicles, bookings and bills.
- Layered code with unit tests for the scheduler, queues and hash layers.

**Risks**

| Risk | Mitigation |
| --- | --- |
| JSON file lost or corrupted on crash | Write to a temp file then rename; keep a backup copy; load all files at startup |
| Race conditions on slot booking | Synchronise the allocation method; concurrent collections; one write lock per user file |
| Long jobs starved by short jobs | Aging rule in section 5 |

**Milestones**

1. Models, collections, seed catalog and per-user JSON persistence
2. Auth and vehicle APIs
3. Scheduler, queues and booking API
4. Mechanic and admin APIs, billing
5. React pages, integration, testing

**Open questions**

- Resolved: 18% GST applies to the whole bill.
- Resolved: bill payment status is not tracked.
