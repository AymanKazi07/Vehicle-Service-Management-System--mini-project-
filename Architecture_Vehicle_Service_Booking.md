# Architecture: Vehicle Service Booking System

## 1. Layers and request flow

Every request moves down one fixed chain: React page, API file, controller, service, store (collections), JSON file.

```
BROWSER (React, port 5173)
  pages/*Page.jsx
     |  uses components/*.jsx, reads AuthContext
     v
  api/*Api.js  -->  api/axiosClient.js  (adds  Authorization: Bearer <JWT>)
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

**Rules that keep it connected cleanly**

- A controller only calls its service; a service only calls stores and other services; a store only touches collections and `JsonFileStorage`.
- Models are plain Java classes shared by all layers; DTOs are used only at the controller edge.
- On startup `JsonFileStorage.loadAll()` fills every store; after every change the service calls `JsonFileStorage.saveUser(userId)`.

## 2. Backend: Spring Boot files

```
backend/
├── pom.xml
├── data/                      (created at runtime)
│   ├── users/<userId>.json
│   ├── workshops.json
│   └── catalog.json
└── src/main/
    ├── resources/
    │   ├── application.properties
    │   └── seed/catalog-seed.json
    └── java/com/vehicleservice/
        ├── VehicleServiceApplication.java
        ├── config/       AppProperties, SecurityConfig, JwtAuthFilter, CorsConfig
        ├── controller/   Auth, Vehicle, Catalog, Booking, Bill, Mechanic, Admin
        ├── service/      Auth, Jwt, Vehicle, Catalog, Booking, Scheduler, Mechanic, Admin, Billing
        ├── store/        User, Vehicle, Catalog, Workshop, Mechanic, Job, Booking, Bill, JsonFileStorage
        ├── scheduler/    SlotAllocator, ShortJobComparator, LongJobComparator, AgingTask
        ├── model/        User, Role, Category, VehicleTree, Vehicle, ServiceRecord, Workshop,
        │                 Mechanic, ServiceItem, QueueClass, Slot, Job, JobStatus, Booking, Bill, BillLine
        ├── dto/          SignupRequest, LoginRequest, AuthResponse, VehicleRequest, BookingRequest,
        │                 BookingResponse, JobStatusRequest, WorkshopRequest, MechanicRequest, BillResponse
        └── exception/    ApiException, GlobalExceptionHandler
```

**Controllers and services: what calls what**

| File | Endpoints / role | Calls |
| --- | --- | --- |
| `AuthController.java` | `POST /api/auth/signup`, `/login` | `AuthService` |
| `VehicleController.java` | `GET/POST /api/vehicles`, `GET /api/vehicles/{regNo}/history` | `VehicleService` |
| `CatalogController.java` | `GET /api/services?category=&subType=` | `CatalogService` |
| `BookingController.java` | `POST/GET /api/bookings` | `BookingService` |
| `BillController.java` | `GET /api/bills/{bookingId}` | `BillingService` |
| `MechanicController.java` | `GET /api/mechanic/jobs`, `PATCH /api/mechanic/jobs/{id}/status` | `MechanicService` |
| `AdminController.java` | `/api/admin/workshops`, `/mechanics`, `PUT /services/{id}` | `AdminService`, `CatalogService` |
| `AuthService.java` | Sign up, BCrypt check, issue token | `UserStore`, `JwtService`, `JsonFileStorage` |
| `JwtService.java` | Create and verify JWT | `AppProperties` |
| `VehicleService.java` | Add vehicle, read tree, read history stack | `VehicleStore`, `JsonFileStorage` |
| `CatalogService.java` | Services for category and sub-type; admin edits | `CatalogStore` |
| `BookingService.java` | Validate request, split into jobs, build `Booking` | `CatalogService`, `VehicleStore`, `SchedulerService`, `BookingStore` |
| `SchedulerService.java` | Pick queue, allocate slot and mechanic per job | `JobStore`, `MechanicStore`, `SlotAllocator` |
| `MechanicService.java` | Move job forward; on last job complete, push history and bill | `JobStore`, `VehicleStore`, `BillingService`, `JsonFileStorage` |
| `BillingService.java` | Subtotal, 18% GST, grand total, `Bill` | `BillStore`, `BookingStore`, `WorkshopStore`, `AppProperties` |
| `AdminService.java` | Create workshop and mechanic accounts | `WorkshopStore`, `MechanicStore`, `UserStore`, `JsonFileStorage` |

**Support files**

| File | Role |
| --- | --- |
| `SecurityConfig.java` | Route rules: `/api/auth/**` public, `/api/admin/**` ADMIN, `/api/mechanic/**` MECHANIC, rest CUSTOMER |
| `JwtAuthFilter.java` | Reads the Bearer token on each request, sets the logged-in user |
| `CorsConfig.java` | Allows `http://localhost:5173` |
| `AppProperties.java` | Binds `application.properties` values (GST rate, 120-minute limit, data directory, JWT secret) |
| `SlotAllocator.java` | Finds the earliest free slot for a mechanic from `TreeMap<LocalDate, List<Slot>>` |
| `ShortJobComparator.java`, `LongJobComparator.java` | Ordering rules for the two queues |
| `AgingTask.java` | `@Scheduled` task that raises priority of Long jobs waiting over 2 days |
| `GlobalExceptionHandler.java` | Turns `ApiException` into JSON errors with an HTTP code |

## 3. Runtime variables

These are the live in-memory objects. Each is owned by one class and rebuilt from JSON on startup.

| Variable | Type | Owner | Purpose |
| --- | --- | --- | --- |
| `usersById` | `ConcurrentHashMap<String, User>` | `UserStore` | Every account (customer, mechanic, admin) |
| `userIdByEmail` | `ConcurrentHashMap<String, String>` | `UserStore` | Login lookup |
| `customerVehicles` | `ConcurrentHashMap<String, VehicleTree>` | `VehicleStore` | Layer 1 hash: customerId to that customer's tree |
| `VehicleTree.tree` | `Map<Category, Map<String, List<Vehicle>>>` | `VehicleTree` | Layers 2 and 3: category, then sub-type |
| `vehicleIndex` | `ConcurrentHashMap<String, Vehicle>` | `VehicleStore` | Registration number to vehicle, O(1) |
| `Vehicle.serviceHistory` | `Stack<ServiceRecord>` | `Vehicle` | Completed work, top = latest |
| `catalog` | `Map<Category, Map<String, List<ServiceItem>>>` | `CatalogStore` | Services with price and minutes |
| `shortQueue` | `PriorityBlockingQueue<Job>` | `JobStore` | Jobs of 120 minutes or less |
| `longQueue` | `PriorityBlockingQueue<Job>` | `JobStore` | Jobs over 120 minutes |
| `jobsById` | `ConcurrentHashMap<String, Job>` | `JobStore` | Job lookup for status updates |
| `bookingsById` | `ConcurrentHashMap<String, Booking>` | `BookingStore` | A booking and its job IDs |
| `mechanicSlots` | `ConcurrentHashMap<String, TreeMap<LocalDate, List<Slot>>>` | `MechanicStore` | Free and booked slots per mechanic |
| `workshopsById` | `ConcurrentHashMap<String, Workshop>` | `WorkshopStore` | Service centres |
| `billsByBookingId` | `ConcurrentHashMap<String, Bill>` | `BillStore` | Final bills |
| `userLocks` | `ConcurrentHashMap<String, ReentrantLock>` | `JsonFileStorage` | One write lock per user file |

**Config values** (`application.properties`, read by `AppProperties`)

| Key | Value |
| --- | --- |
| `app.gst.rate` | `0.18` |
| `app.short-job-max-minutes` | `120` |
| `app.work.start-hour`, `app.work.end-hour` | `9`, `18` |
| `app.aging.days` | `2` |
| `app.data.dir` | `data` |
| `app.jwt.secret`, `app.jwt.expiry-minutes` | set by you; for example 120 |
| `server.port` | `8080` |

**Key model fields**

- `Job`: `jobId`, `bookingId`, `customerId`, `vehicleRegNo`, `serviceItemId`, `queueClass`, `date`, `slotStart`, `mechanicId`, `status`, `estimatedEnd`.
- `Booking`: `bookingId`, `customerId`, `vehicleRegNo`, `date`, `jobIds`, `overallEnd`, `createdAt`.
- `Bill`: `billId`, `bookingId`, `date`, `vehicleRegNo`, `ownerName`, `workshopName`, `lines` (service, mechanic, price), `subtotal`, `gstRate`, `gstAmount`, `grandTotal`.
- `ServiceRecord`: `bookingId`, `date`, `services`, `mechanicNames`, `workshopName`, `total`.

**JSON files on disk**

- `data/users/<userId>.json`: profile; for a customer also the vehicle tree, service stacks, bookings and bills; for a mechanic also `workshopId`, categories and slots.
- `data/workshops.json` and `data/catalog.json`: shared data written by the admin.
- Open choice: queues are rebuilt at startup from jobs with status Pending, so no queue file is needed.

## 4. Frontend: React files

```
frontend/
├── package.json, vite.config.js, index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── api/         axiosClient.js, authApi.js, vehicleApi.js, catalogApi.js,
    │                bookingApi.js, billApi.js, mechanicApi.js, adminApi.js
    ├── context/     AuthContext.jsx
    ├── routes/      ProtectedRoute.jsx
    ├── pages/       AuthPage.jsx, DashboardPage.jsx, MechanicPage.jsx, AdminPage.jsx
    ├── components/  Navbar, LoginForm, SignupForm, VehicleCard, AddVehicleForm,
    │                ServiceHistoryList, BookingForm, ServicePicker, BookingConfirmation,
    │                BillView, JobTable, JobStatusButtons, WorkshopForm, MechanicForm,
    │                DataTable, StatusBadge   (each .jsx)
    ├── utils/       constants.js, formatters.js
    └── styles/      app.css
```

**Core files**

| File | Role | Connected to |
| --- | --- | --- |
| `main.jsx` | Mounts React, wraps app in `AuthProvider` and `BrowserRouter` | `App.jsx`, `AuthContext.jsx` |
| `App.jsx` | Route table: `/auth`, `/dashboard`, `/mechanic`, `/admin` | the 4 pages, `ProtectedRoute.jsx` |
| `AuthContext.jsx` | Holds `user`, `token`, `role`; `login()`, `logout()`; saves token in `localStorage` | `authApi.js`, `axiosClient.js` |
| `ProtectedRoute.jsx` | Redirects to `/auth` if no token or wrong role | `AuthContext.jsx` |
| `axiosClient.js` | Axios instance with base URL `http://localhost:8080/api` and a request interceptor that adds the JWT | every `*Api.js` file |

**Pages, their components and API files**

| Page (route) | Components used | API files used | Backend controller |
| --- | --- | --- | --- |
| `AuthPage.jsx` (`/auth`) | `LoginForm`, `SignupForm` | `authApi.js` | `AuthController` |
| `DashboardPage.jsx` (`/dashboard`) | `Navbar`, `VehicleCard`, `AddVehicleForm`, `ServiceHistoryList`, `BookingForm`, `ServicePicker`, `BookingConfirmation`, `BillView`, `StatusBadge` | `vehicleApi.js`, `catalogApi.js`, `bookingApi.js`, `billApi.js` | `VehicleController`, `CatalogController`, `BookingController`, `BillController` |
| `MechanicPage.jsx` (`/mechanic`) | `Navbar`, `JobTable`, `JobStatusButtons`, `StatusBadge` | `mechanicApi.js` | `MechanicController` |
| `AdminPage.jsx` (`/admin`) | `Navbar`, `WorkshopForm`, `MechanicForm`, `DataTable` | `adminApi.js`, `catalogApi.js` | `AdminController`, `CatalogController` |

**Component data flow**

- `DashboardPage` holds state: `vehicles`, `selectedVehicle`, `history`, `services`, `selectedServices`, `bookingDate`, `bookingResult`, `bill`.
- `BookingForm` shows `ServicePicker`, sends `POST /api/bookings`, then passes the response to `BookingConfirmation`.
- `MechanicPage` holds `jobs`; `JobStatusButtons` calls `mechanicApi.updateJobStatus(jobId, status, notes)` then refreshes `jobs`.
- `AdminPage` holds `workshops`, `mechanics`; the forms call `adminApi` then refresh the tables.
- `constants.js` exports `CATEGORIES`, `SUB_TYPES`, `JOB_STATUS`, `ROLES`, shared by forms and badges.

## 5. End-to-end flows, file by file

**A. Login**

1. `LoginForm.jsx` calls `authApi.login(email, password)`, which uses `axiosClient.js`.
2. `AuthController.login` calls `AuthService.login`, which reads `UserStore.userIdByEmail` and `usersById`, checks BCrypt, and asks `JwtService` for a token.
3. `AuthContext.login()` stores the token and role; `App.jsx` sends the user to `/dashboard`, `/mechanic` or `/admin`.

**B. Customer books several services**

1. `BookingForm.jsx` posts `{vehicleRegNo, date, serviceItemIds[]}` through `bookingApi.js`.
2. `BookingController` calls `BookingService.createBooking`, which reads each `ServiceItem` from `CatalogService` and confirms the vehicle in `VehicleStore.vehicleIndex`.
3. For each service it builds a `Job` and calls `SchedulerService.schedule(job)`.
4. `SchedulerService` compares `expectedMinutes` with `app.short-job-max-minutes` (120), sets `queueClass`, and adds the job to `JobStore.shortQueue` or `longQueue`.
5. `SlotAllocator` scans `MechanicStore.mechanicSlots` for the earliest free slot on or after the chosen date, sets `mechanicId`, `slotStart` and `estimatedEnd`. Different services can get different mechanics.
6. `BookingService` saves the `Booking` in `BookingStore`, calls `JsonFileStorage.saveUser` for the customer and each mechanic, and returns `BookingResponse` (one line per job, plus `overallEnd`).
7. `BookingConfirmation.jsx` shows each service with its slot, mechanic, workshop and estimated time.

**C. Mechanic updates status and completes**

1. `JobTable.jsx` lists jobs from `mechanicApi.getJobs()`; `JobStatusButtons.jsx` calls `PATCH /api/mechanic/jobs/{id}/status`.
2. `MechanicService.updateStatus` checks the job's `mechanicId` matches the token, allows only Pending, then In Progress, then Completed, and saves the files.
3. When every job of the booking is Completed, `MechanicService` calls `BillingService.generate(bookingId)`: sum of line prices, times 0.18 for GST, plus subtotal for grand total.
4. It pushes one `ServiceRecord` onto `Vehicle.serviceHistory` (the stack) and saves the customer's JSON file.
5. `BillView.jsx` loads `GET /api/bills/{bookingId}` and shows date, vehicle number, owner, mechanic per service, workshop, service-wise price, subtotal, GST and grand total.

**D. Admin adds a mechanic**

1. `MechanicForm.jsx` posts through `adminApi.js` to `AdminController`.
2. `AdminService` creates a `User` with role MECHANIC in `UserStore`, a `Mechanic` in `MechanicStore` with empty `mechanicSlots`, and saves `data/users/<id>.json`.

**E. Startup**

`VehicleServiceApplication` starts, `AppProperties` loads config, `JsonFileStorage.loadAll()` fills every store, `CatalogStore` loads `catalog.json` or `seed/catalog-seed.json`, then the queues are rebuilt from jobs still Pending.
