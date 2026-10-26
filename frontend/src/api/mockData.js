// src/api/mockData.js
// In-memory mock store initialized with realistic demo data matching PRD shapes

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const initialUsers = [
  {
    userId: 'usr-customer-1',
    name: 'Aarav Sharma',
    email: 'customer@test.com',
    password: 'password123',
    role: 'CUSTOMER',
    workshopId: null,
  },
  {
    userId: 'usr-mechanic-1',
    name: 'Rajesh Kumar',
    email: 'mechanic@test.com',
    password: 'password123',
    role: 'MECHANIC',
    workshopId: 'ws-1',
  },
  {
    userId: 'usr-admin-1',
    name: 'Vikram Singh',
    email: 'admin@test.com',
    password: 'password123',
    role: 'ADMIN',
    workshopId: null,
  },
];

const initialWorkshops = [
  {
    id: 'ws-1',
    name: 'Apex SpeedWorks Central',
    address: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
    contact: '+91 98200 11223',
  },
  {
    id: 'ws-2',
    name: 'Metro Precision Auto Hub',
    address: 'Sector 18, Industrial Estate, Gurugram 122015',
    contact: '+91 98111 44556',
  },
];

const initialMechanics = [
  {
    id: 'mec-1',
    name: 'Rajesh Kumar',
    email: 'mechanic@test.com',
    workshopId: 'ws-1',
    workshopName: 'Apex SpeedWorks Central',
    categories: ['TWO_WHEELER', 'FOUR_WHEELER'],
  },
  {
    id: 'mec-2',
    name: 'Sunil Verma',
    email: 'sunil.v@speedworks.com',
    workshopId: 'ws-1',
    workshopName: 'Apex SpeedWorks Central',
    categories: ['THREE_WHEELER', 'HEAVY'],
  },
  {
    id: 'mec-3',
    name: 'Anil Desai',
    email: 'anil.desai@metrohub.com',
    workshopId: 'ws-2',
    workshopName: 'Metro Precision Auto Hub',
    categories: ['FOUR_WHEELER', 'HEAVY'],
  },
];

const initialCatalog = [
  // 2-Wheeler / Geared
  { id: 'srv-2wg-1', category: 'TWO_WHEELER', subType: 'Geared', name: 'General service', price: 600, expectedMinutes: 90, queueClass: 'SHORT' },
  { id: 'srv-2wg-2', category: 'TWO_WHEELER', subType: 'Geared', name: 'Oil change', price: 350, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-2wg-3', category: 'TWO_WHEELER', subType: 'Geared', name: 'Chain clean and lube', price: 250, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-2wg-4', category: 'TWO_WHEELER', subType: 'Geared', name: 'Brake pad replacement', price: 400, expectedMinutes: 45, queueClass: 'SHORT' },
  { id: 'srv-2wg-5', category: 'TWO_WHEELER', subType: 'Geared', name: 'Tyre replacement', price: 500, expectedMinutes: 45, queueClass: 'SHORT' },
  { id: 'srv-2wg-6', category: 'TWO_WHEELER', subType: 'Geared', name: 'Battery replacement', price: 300, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-2wg-7', category: 'TWO_WHEELER', subType: 'Geared', name: 'Clutch plate replacement', price: 900, expectedMinutes: 120, queueClass: 'SHORT' },
  { id: 'srv-2wg-8', category: 'TWO_WHEELER', subType: 'Geared', name: 'Engine overhaul', price: 6000, expectedMinutes: 480, queueClass: 'LONG' },
  { id: 'srv-2wg-9', category: 'TWO_WHEELER', subType: 'Geared', name: 'Full body painting', price: 5000, expectedMinutes: 720, queueClass: 'LONG' },

  // 2-Wheeler / Scooter
  { id: 'srv-2ws-1', category: 'TWO_WHEELER', subType: 'Scooter', name: 'General service', price: 500, expectedMinutes: 75, queueClass: 'SHORT' },
  { id: 'srv-2ws-2', category: 'TWO_WHEELER', subType: 'Scooter', name: 'Oil change', price: 300, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-2ws-3', category: 'TWO_WHEELER', subType: 'Scooter', name: 'Brake adjustment', price: 200, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-2ws-4', category: 'TWO_WHEELER', subType: 'Scooter', name: 'CVT belt replacement', price: 800, expectedMinutes: 90, queueClass: 'SHORT' },
  { id: 'srv-2ws-5', category: 'TWO_WHEELER', subType: 'Scooter', name: 'Throttle body cleaning', price: 400, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-2ws-6', category: 'TWO_WHEELER', subType: 'Scooter', name: 'Engine overhaul', price: 5500, expectedMinutes: 420, queueClass: 'LONG' },
  { id: 'srv-2ws-7', category: 'TWO_WHEELER', subType: 'Scooter', name: 'Full body painting', price: 4500, expectedMinutes: 720, queueClass: 'LONG' },

  // 2-Wheeler / EV
  { id: 'srv-2we-1', category: 'TWO_WHEELER', subType: 'EV', name: 'Battery and motor check', price: 700, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-2we-2', category: 'TWO_WHEELER', subType: 'EV', name: 'Charger and wiring inspection', price: 450, expectedMinutes: 45, queueClass: 'SHORT' },
  { id: 'srv-2we-3', category: 'TWO_WHEELER', subType: 'EV', name: 'Brake service', price: 350, expectedMinutes: 45, queueClass: 'SHORT' },
  { id: 'srv-2we-4', category: 'TWO_WHEELER', subType: 'EV', name: 'Software update and diagnostics', price: 500, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-2we-5', category: 'TWO_WHEELER', subType: 'EV', name: 'Motor replacement', price: 15000, expectedMinutes: 480, queueClass: 'LONG' },
  { id: 'srv-2we-6', category: 'TWO_WHEELER', subType: 'EV', name: 'Battery pack replacement', price: 25000, expectedMinutes: 360, queueClass: 'LONG' },

  // 3-Wheeler / CNG
  { id: 'srv-3wc-1', category: 'THREE_WHEELER', subType: 'CNG', name: 'Gas kit inspection', price: 800, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-3wc-2', category: 'THREE_WHEELER', subType: 'CNG', name: 'Oil and filter change', price: 700, expectedMinutes: 45, queueClass: 'SHORT' },
  { id: 'srv-3wc-3', category: 'THREE_WHEELER', subType: 'CNG', name: 'Brake service', price: 600, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-3wc-4', category: 'THREE_WHEELER', subType: 'CNG', name: 'Cylinder hydro-test', price: 1500, expectedMinutes: 120, queueClass: 'SHORT' },
  { id: 'srv-3wc-5', category: 'THREE_WHEELER', subType: 'CNG', name: 'Clutch replacement', price: 1800, expectedMinutes: 180, queueClass: 'LONG' },
  { id: 'srv-3wc-6', category: 'THREE_WHEELER', subType: 'CNG', name: 'Engine overhaul', price: 9000, expectedMinutes: 720, queueClass: 'LONG' },

  // 3-Wheeler / Petrol
  { id: 'srv-3wp-1', category: 'THREE_WHEELER', subType: 'Petrol', name: 'Engine tune-up', price: 1200, expectedMinutes: 120, queueClass: 'SHORT' },
  { id: 'srv-3wp-2', category: 'THREE_WHEELER', subType: 'Petrol', name: 'Oil change', price: 400, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-3wp-3', category: 'THREE_WHEELER', subType: 'Petrol', name: 'Spark plug replacement', price: 250, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-3wp-4', category: 'THREE_WHEELER', subType: 'Petrol', name: 'Brake service', price: 600, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-3wp-5', category: 'THREE_WHEELER', subType: 'Petrol', name: 'Gearbox repair', price: 4000, expectedMinutes: 360, queueClass: 'LONG' },
  { id: 'srv-3wp-6', category: 'THREE_WHEELER', subType: 'Petrol', name: 'Full body painting', price: 8000, expectedMinutes: 1440, queueClass: 'LONG' },

  // 4-Wheeler / Petrol
  { id: 'srv-4wp-1', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'Oil and filter change', price: 1200, expectedMinutes: 45, queueClass: 'SHORT' },
  { id: 'srv-4wp-2', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'Battery replacement', price: 800, expectedMinutes: 30, queueClass: 'SHORT' },
  { id: 'srv-4wp-3', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'Wheel alignment and balancing', price: 1000, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-4wp-4', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'Brake pad replacement', price: 1800, expectedMinutes: 90, queueClass: 'SHORT' },
  { id: 'srv-4wp-5', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'AC service', price: 2000, expectedMinutes: 120, queueClass: 'SHORT' },
  { id: 'srv-4wp-6', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'General service', price: 2500, expectedMinutes: 180, queueClass: 'LONG' },
  { id: 'srv-4wp-7', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'Clutch replacement', price: 6000, expectedMinutes: 300, queueClass: 'LONG' },
  { id: 'srv-4wp-8', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'Engine overhaul', price: 25000, expectedMinutes: 1440, queueClass: 'LONG' },
  { id: 'srv-4wp-9', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'Interior detailing', price: 3000, expectedMinutes: 180, queueClass: 'LONG' },
  { id: 'srv-4wp-10', category: 'FOUR_WHEELER', subType: 'Petrol', name: 'Dent and scratch repair', price: 6000, expectedMinutes: 480, queueClass: 'LONG' },

  // 4-Wheeler / CNG
  { id: 'srv-4wc-1', category: 'FOUR_WHEELER', subType: 'CNG', name: 'CNG kit inspection', price: 1000, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-4wc-2', category: 'FOUR_WHEELER', subType: 'CNG', name: 'Oil and filter change', price: 1300, expectedMinutes: 45, queueClass: 'SHORT' },
  { id: 'srv-4wc-3', category: 'FOUR_WHEELER', subType: 'CNG', name: 'Regulator and injector cleaning', price: 1500, expectedMinutes: 90, queueClass: 'SHORT' },
  { id: 'srv-4wc-4', category: 'FOUR_WHEELER', subType: 'CNG', name: 'Cylinder hydro-test', price: 2000, expectedMinutes: 120, queueClass: 'SHORT' },
  { id: 'srv-4wc-5', category: 'FOUR_WHEELER', subType: 'CNG', name: 'General service', price: 2800, expectedMinutes: 180, queueClass: 'LONG' },
  { id: 'srv-4wc-6', category: 'FOUR_WHEELER', subType: 'CNG', name: 'Engine overhaul', price: 28000, expectedMinutes: 1440, queueClass: 'LONG' },

  // 4-Wheeler / Diesel
  { id: 'srv-4wd-1', category: 'FOUR_WHEELER', subType: 'Diesel', name: 'Oil and filter change', price: 1800, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-4wd-2', category: 'FOUR_WHEELER', subType: 'Diesel', name: 'Fuel filter replacement', price: 1200, expectedMinutes: 60, queueClass: 'SHORT' },
  { id: 'srv-4wd-3', category: 'FOUR_WHEELER', subType: 'Diesel', name: 'General service', price: 3000, expectedMinutes: 180, queueClass: 'LONG' },
  { id: 'srv-4wd-4', category: 'FOUR_WHEELER', subType: 'Diesel', name: 'Clutch replacement', price: 7000, expectedMinutes: 300, queueClass: 'LONG' },
  { id: 'srv-4wd-5', category: 'FOUR_WHEELER', subType: 'Diesel', name: 'Turbocharger repair', price: 12000, expectedMinutes: 480, queueClass: 'LONG' },
  { id: 'srv-4wd-6', category: 'FOUR_WHEELER', subType: 'Diesel', name: 'Engine replacement', price: 60000, expectedMinutes: 1440, queueClass: 'LONG' },

  // 4-Wheeler / EV
  { id: 'srv-4we-1', category: 'FOUR_WHEELER', subType: 'EV', name: 'Battery diagnostics', price: 1500, expectedMinutes: 90, queueClass: 'SHORT' },
  { id: 'srv-4we-2', category: 'FOUR_WHEELER', subType: 'EV', name: 'Brake service', price: 1800, expectedMinutes: 90, queueClass: 'SHORT' },
  { id: 'srv-4we-3', category: 'FOUR_WHEELER', subType: 'EV', name: 'Coolant system service', price: 2200, expectedMinutes: 120, queueClass: 'SHORT' },
  { id: 'srv-4we-4', category: 'FOUR_WHEELER', subType: 'EV', name: 'Charging port repair', price: 3500, expectedMinutes: 180, queueClass: 'LONG' },
  { id: 'srv-4we-5', category: 'FOUR_WHEELER', subType: 'EV', name: 'Battery pack replacement', price: 250000, expectedMinutes: 1440, queueClass: 'LONG' },

  // Heavy Vehicles / DEFAULT
  { id: 'srv-hv-1', category: 'HEAVY', subType: 'DEFAULT', name: 'Oil and filter change', price: 3500, expectedMinutes: 90, queueClass: 'SHORT' },
  { id: 'srv-hv-2', category: 'HEAVY', subType: 'DEFAULT', name: 'Tyre replacement', price: 12000, expectedMinutes: 120, queueClass: 'SHORT' },
  { id: 'srv-hv-3', category: 'HEAVY', subType: 'DEFAULT', name: 'Air brake system service', price: 5000, expectedMinutes: 180, queueClass: 'LONG' },
  { id: 'srv-hv-4', category: 'HEAVY', subType: 'DEFAULT', name: 'General service', price: 6000, expectedMinutes: 240, queueClass: 'LONG' },
  { id: 'srv-hv-5', category: 'HEAVY', subType: 'DEFAULT', name: 'Brake relining', price: 8000, expectedMinutes: 360, queueClass: 'LONG' },
  { id: 'srv-hv-6', category: 'HEAVY', subType: 'DEFAULT', name: 'Chassis welding repair', price: 15000, expectedMinutes: 720, queueClass: 'LONG' },
  { id: 'srv-hv-7', category: 'HEAVY', subType: 'DEFAULT', name: 'Gearbox overhaul', price: 35000, expectedMinutes: 1440, queueClass: 'LONG' },
  { id: 'srv-hv-8', category: 'HEAVY', subType: 'DEFAULT', name: 'Engine replacement', price: 120000, expectedMinutes: 2880, queueClass: 'LONG' },
];

const initialVehicles = [
  {
    registrationNumber: 'MH02AB1234',
    ownerName: 'Aarav Sharma',
    modelName: 'Royal Enfield Classic 350',
    category: 'TWO_WHEELER',
    subType: 'Geared',
    lastService: '2026-09-15',
  },
  {
    registrationNumber: 'DL01XY9876',
    ownerName: 'Aarav Sharma',
    modelName: 'Hyundai Creta SX',
    category: 'FOUR_WHEELER',
    subType: 'Petrol',
    lastService: '2026-08-20',
  },
  {
    registrationNumber: 'KA04CD5678',
    ownerName: 'Aarav Sharma',
    modelName: 'Tata Prima 4028.S',
    category: 'HEAVY',
    subType: 'DEFAULT',
    lastService: '2026-07-10',
  },
];

const initialServiceHistory = {
  MH02AB1234: [
    {
      bookingId: 'BKG-101',
      date: '2026-09-15',
      services: ['General service', 'Oil change'],
      mechanicNames: ['Rajesh Kumar'],
      workshopName: 'Apex SpeedWorks Central',
      subtotal: 950,
      gst: 171,
      total: 1121,
      status: 'COMPLETED',
    },
    {
      bookingId: 'BKG-098',
      date: '2026-05-10',
      services: ['Chain clean and lube', 'Brake pad replacement'],
      mechanicNames: ['Rajesh Kumar'],
      workshopName: 'Apex SpeedWorks Central',
      subtotal: 650,
      gst: 117,
      total: 767,
      status: 'COMPLETED',
    },
  ],
  DL01XY9876: [
    {
      bookingId: 'BKG-102',
      date: '2026-08-20',
      services: ['Oil and filter change', 'Wheel alignment and balancing'],
      mechanicNames: ['Rajesh Kumar'],
      workshopName: 'Apex SpeedWorks Central',
      subtotal: 2200,
      gst: 396,
      total: 2596,
      status: 'COMPLETED',
    },
  ],
  KA04CD5678: [
    {
      bookingId: 'BKG-090',
      date: '2026-07-10',
      services: ['Oil and filter change', 'Air brake system service'],
      mechanicNames: ['Sunil Verma'],
      workshopName: 'Apex SpeedWorks Central',
      subtotal: 8500,
      gst: 1530,
      total: 10030,
      status: 'COMPLETED',
    },
  ],
};

const initialBills = {
  'BKG-101': {
    billId: 'INV-BKG-101',
    bookingId: 'BKG-101',
    date: '2026-09-15',
    vehicleRegNo: 'MH02AB1234',
    ownerName: 'Aarav Sharma',
    workshopName: 'Apex SpeedWorks Central',
    workshopAddress: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
    lines: [
      { serviceName: 'General service', mechanicName: 'Rajesh Kumar', price: 600 },
      { serviceName: 'Oil change', mechanicName: 'Rajesh Kumar', price: 350 },
    ],
    subtotal: 950,
    gstRate: 0.18,
    gstAmount: 171,
    grandTotal: 1121,
  },
  'BKG-102': {
    billId: 'INV-BKG-102',
    bookingId: 'BKG-102',
    date: '2026-08-20',
    vehicleRegNo: 'DL01XY9876',
    ownerName: 'Aarav Sharma',
    workshopName: 'Apex SpeedWorks Central',
    workshopAddress: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
    lines: [
      { serviceName: 'Oil and filter change', mechanicName: 'Rajesh Kumar', price: 1200 },
      { serviceName: 'Wheel alignment and balancing', mechanicName: 'Rajesh Kumar', price: 1000 },
    ],
    subtotal: 2200,
    gstRate: 0.18,
    gstAmount: 396,
    grandTotal: 2596,
  },
  'BKG-090': {
    billId: 'INV-BKG-090',
    bookingId: 'BKG-090',
    date: '2026-07-10',
    vehicleRegNo: 'KA04CD5678',
    ownerName: 'Aarav Sharma',
    workshopName: 'Apex SpeedWorks Central',
    workshopAddress: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
    lines: [
      { serviceName: 'Oil and filter change', mechanicName: 'Sunil Verma', price: 3500 },
      { serviceName: 'Air brake system service', mechanicName: 'Sunil Verma', price: 5000 },
    ],
    subtotal: 8500,
    gstRate: 0.18,
    gstAmount: 1530,
    grandTotal: 10030,
  },
};

const todayStr = new Date().toISOString().slice(0, 10);
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrowStr = tomorrowDate.toISOString().slice(0, 10);

const initialJobs = [
  {
    jobId: 'JOB-201',
    bookingId: 'BKG-201',
    vehicleRegNo: 'MH02AB1234',
    serviceName: 'Brake pad replacement',
    date: todayStr,
    slotStart: '09:00',
    expectedMinutes: 45,
    status: 'PENDING',
    notes: '',
  },
  {
    jobId: 'JOB-202',
    bookingId: 'BKG-202',
    vehicleRegNo: 'DL01XY9876',
    serviceName: 'AC service',
    date: todayStr,
    slotStart: '11:00',
    expectedMinutes: 120,
    status: 'IN_PROGRESS',
    notes: 'Compressor refrigerant topped up, inspecting condenser coil.',
  },
  {
    jobId: 'JOB-203',
    bookingId: 'BKG-203',
    vehicleRegNo: 'MH02AB1234',
    serviceName: 'Engine overhaul',
    date: tomorrowStr,
    slotStart: '09:00',
    expectedMinutes: 480,
    status: 'PENDING',
    notes: '',
  },
  {
    jobId: 'JOB-204',
    bookingId: 'BKG-101',
    vehicleRegNo: 'MH02AB1234',
    serviceName: 'General service',
    date: '2026-09-15',
    slotStart: '10:00',
    expectedMinutes: 90,
    status: 'COMPLETED',
    notes: 'Complete multi-point inspection done. Oil and filters replaced.',
  },
];

const initialBookings = [
  {
    bookingId: 'BKG-201',
    date: todayStr,
    vehicleRegNo: 'MH02AB1234',
    ownerName: 'Aarav Sharma',
    serviceNames: ['Brake pad replacement'],
    overallEnd: '09:45',
    status: 'PENDING',
    total: 472,
  },
  {
    bookingId: 'BKG-202',
    date: todayStr,
    vehicleRegNo: 'DL01XY9876',
    ownerName: 'Aarav Sharma',
    serviceNames: ['AC service'],
    overallEnd: '13:00',
    status: 'IN_PROGRESS',
    total: 2360,
  },
  {
    bookingId: 'BKG-101',
    date: '2026-09-15',
    vehicleRegNo: 'MH02AB1234',
    ownerName: 'Aarav Sharma',
    serviceNames: ['General service', 'Oil change'],
    overallEnd: '12:00',
    status: 'COMPLETED',
    total: 1121,
  },
];

// Persistent mock state in memory
class MockState {
  constructor() {
    this.users = [...initialUsers];
    this.workshops = [...initialWorkshops];
    this.mechanics = [...initialMechanics];
    this.catalog = [...initialCatalog];
    this.vehicles = [...initialVehicles];
    this.serviceHistory = { ...initialServiceHistory };
    this.bills = { ...initialBills };
    this.jobs = [...initialJobs];
    this.bookings = [...initialBookings];
  }

  async login(emailOrPayload, password) {
    await delay();
    let email = typeof emailOrPayload === 'object' && emailOrPayload !== null ? emailOrPayload.email : emailOrPayload;
    let pwd = typeof emailOrPayload === 'object' && emailOrPayload !== null ? emailOrPayload.password : password;
    email = (email || '').trim();

    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Allow dynamic login for testing: create customer or infer role
      let role = 'CUSTOMER';
      if (email.includes('admin')) role = 'ADMIN';
      else if (email.includes('mechanic')) role = 'MECHANIC';

      return {
        token: `mock-jwt-${Date.now()}`,
        userId: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role,
        workshopId: role === 'MECHANIC' ? 'ws-1' : null,
      };
    }
    if (user.password && pwd && user.password !== pwd) {
      throw new Error('Invalid email or password');
    }
    return {
      token: `mock-jwt-${user.userId}`,
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      workshopId: user.workshopId,
    };
  }

  async signup(nameOrPayload, emailArg, passwordArg) {
    await delay();
    let name = typeof nameOrPayload === 'object' && nameOrPayload !== null ? nameOrPayload.name : nameOrPayload;
    let email = typeof nameOrPayload === 'object' && nameOrPayload !== null ? nameOrPayload.email : emailArg;
    let password = typeof nameOrPayload === 'object' && nameOrPayload !== null ? nameOrPayload.password : passwordArg;

    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }
    const exists = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists');
    }
    const newUser = {
      userId: `usr-${Date.now()}`,
      name,
      email,
      password,
      role: 'CUSTOMER',
      workshopId: null,
    };
    this.users.push(newUser);
    return {
      token: `mock-jwt-${newUser.userId}`,
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      workshopId: null,
    };
  }

  async getVehicles() {
    await delay();
    return [...this.vehicles];
  }

  async addVehicle(vehicleData) {
    await delay();
    const regNo = (vehicleData.registrationNumber || '').trim().toUpperCase();
    if (!regNo) throw new Error('Registration number is required');
    if (this.vehicles.some((v) => v.registrationNumber.toUpperCase() === regNo)) {
      throw new Error(`Vehicle with registration ${regNo} is already registered`);
    }

    const newVehicle = {
      registrationNumber: regNo,
      ownerName: vehicleData.ownerName || 'Vehicle Owner',
      modelName: vehicleData.modelName || 'Custom Model',
      category: vehicleData.category,
      subType: vehicleData.category === 'HEAVY' ? 'DEFAULT' : vehicleData.subType,
      lastService: null,
    };
    this.vehicles.unshift(newVehicle);
    this.serviceHistory[regNo] = [];
    return newVehicle;
  }

  async getHistory(regNo) {
    await delay();
    const upper = (regNo || '').trim().toUpperCase();
    return this.serviceHistory[upper] || [];
  }

  async getServices(category, subType) {
    await delay();
    let list = this.catalog;
    if (category) {
      list = list.filter((s) => s.category === category);
    }
    if (subType && category !== 'HEAVY') {
      list = list.filter((s) => s.subType.toLowerCase() === subType.toLowerCase());
    }
    return list;
  }

  async updateService(id, body) {
    await delay();
    const idx = this.catalog.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Service item not found');
    const updated = { ...this.catalog[idx], ...body };
    if (updated.expectedMinutes) {
      updated.queueClass = updated.expectedMinutes <= 120 ? 'SHORT' : 'LONG';
    }
    this.catalog[idx] = updated;
    return updated;
  }

  async createBooking({ vehicleRegNo, date, serviceItemIds }) {
    await delay();
    const bookingId = `BKG-${Date.now().toString().slice(-4)}`;
    const regNo = (vehicleRegNo || '').toUpperCase();
    const vehicle = this.vehicles.find((v) => v.registrationNumber === regNo);
    const selectedItems = this.catalog.filter((s) => serviceItemIds.includes(s.id));

    if (selectedItems.length === 0) {
      throw new Error('Please select at least one service');
    }

    let currentSlotHour = 9;
    let maxHour = 9;
    let maxMin = 0;

    const lines = selectedItems.map((item, idx) => {
      const jobId = `JOB-${bookingId}-${idx + 1}`;
      const slotStart = `${String(currentSlotHour).padStart(2, '0')}:00`;
      const endMinsTotal = currentSlotHour * 60 + item.expectedMinutes;
      const endHour = Math.floor(endMinsTotal / 60);
      const endMin = endMinsTotal % 60;
      const estimatedEnd = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      if (endMinsTotal > maxHour * 60 + maxMin) {
        maxHour = endHour;
        maxMin = endMin;
      }

      currentSlotHour = endHour;

      const job = {
        jobId,
        bookingId,
        vehicleRegNo: regNo,
        serviceName: item.name,
        price: item.price,
        date,
        slotStart,
        expectedMinutes: item.expectedMinutes,
        estimatedEnd,
        mechanicName: idx % 2 === 0 ? 'Rajesh Kumar' : 'Sunil Verma',
        workshopName: 'Apex SpeedWorks Central',
        status: 'PENDING',
        notes: '',
      };

      this.jobs.unshift(job);
      return job;
    });

    const overallEnd = `${String(maxHour).padStart(2, '0')}:${String(maxMin).padStart(2, '0')}`;
    const subtotal = selectedItems.reduce((acc, s) => acc + s.price, 0);
    const gstAmount = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gstAmount;

    const bookingResponse = {
      bookingId,
      date,
      vehicleRegNo: regNo,
      ownerName: vehicle ? vehicle.ownerName : 'Vehicle Owner',
      overallEnd,
      total: grandTotal,
      lines,
    };

    this.bookings.unshift({
      bookingId,
      date,
      vehicleRegNo: regNo,
      ownerName: vehicle ? vehicle.ownerName : 'Vehicle Owner',
      serviceNames: selectedItems.map((s) => s.name),
      overallEnd,
      status: 'PENDING',
      total: grandTotal,
    });

    // Seed bill for when this booking completes
    this.bills[bookingId] = {
      billId: `INV-${bookingId}`,
      bookingId,
      date,
      vehicleRegNo: regNo,
      ownerName: vehicle ? vehicle.ownerName : 'Vehicle Owner',
      workshopName: 'Apex SpeedWorks Central',
      workshopAddress: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
      lines: selectedItems.map((s, idx) => ({
        serviceName: s.name,
        mechanicName: idx % 2 === 0 ? 'Rajesh Kumar' : 'Sunil Verma',
        price: s.price,
      })),
      subtotal,
      gstRate: 0.18,
      gstAmount,
      grandTotal,
    };

    return bookingResponse;
  }

  async getBookings() {
    await delay();
    return [...this.bookings];
  }

  async getBill(bookingId) {
    await delay();
    const bill = this.bills[bookingId];
    if (!bill) {
      throw new Error(`Bill not found for booking ${bookingId}`);
    }
    return bill;
  }

  async getJobs() {
    await delay();
    return [...this.jobs];
  }

  async updateJobStatus(jobId, status, notes) {
    await delay();
    const job = this.jobs.find((j) => j.jobId === jobId);
    if (!job) throw new Error('Job not found');

    job.status = status;
    if (notes !== undefined) job.notes = notes;

    // If job completed, check if all jobs for booking are completed
    if (status === 'COMPLETED') {
      const bookingJobs = this.jobs.filter((j) => j.bookingId === job.bookingId);
      const allDone = bookingJobs.every((j) => j.status === 'COMPLETED');
      if (allDone) {
        // Update booking
        const b = this.bookings.find((item) => item.bookingId === job.bookingId);
        if (b) b.status = 'COMPLETED';

        // Update vehicle lastService and push to service history
        const vehicle = this.vehicles.find((v) => v.registrationNumber === job.vehicleRegNo);
        if (vehicle) {
          vehicle.lastService = job.date;
        }

        const bill = this.bills[job.bookingId];
        if (!this.serviceHistory[job.vehicleRegNo]) {
          this.serviceHistory[job.vehicleRegNo] = [];
        }

        // Avoid duplicate history record
        if (!this.serviceHistory[job.vehicleRegNo].some((rec) => rec.bookingId === job.bookingId)) {
          this.serviceHistory[job.vehicleRegNo].unshift({
            bookingId: job.bookingId,
            date: job.date,
            services: bookingJobs.map((j) => j.serviceName),
            mechanicNames: Array.from(new Set(bookingJobs.map((j) => j.mechanicName || 'Rajesh Kumar'))),
            workshopName: 'Apex SpeedWorks Central',
            subtotal: bill ? bill.subtotal : 1000,
            gst: bill ? bill.gstAmount : 180,
            total: bill ? bill.grandTotal : 1180,
            status: 'COMPLETED',
          });
        }
      }
    }

    return job;
  }

  async getWorkshops() {
    await delay();
    return [...this.workshops];
  }

  async addWorkshop(body) {
    await delay();
    const newWs = {
      id: `ws-${Date.now().toString().slice(-4)}`,
      name: body.name,
      address: body.address,
      contact: body.contact,
    };
    this.workshops.push(newWs);
    return newWs;
  }

  async getMechanics() {
    await delay();
    return [...this.mechanics];
  }

  async addMechanic(body) {
    await delay();
    const ws = this.workshops.find((w) => w.id === body.workshopId);
    const newMec = {
      id: `mec-${Date.now().toString().slice(-4)}`,
      name: body.name,
      email: body.email,
      workshopId: body.workshopId,
      workshopName: ws ? ws.name : 'Workshop',
      categories: body.categories || [],
    };
    this.mechanics.push(newMec);
    this.users.push({
      userId: newMec.id,
      name: body.name,
      email: body.email,
      password: body.password || 'password123',
      role: 'MECHANIC',
      workshopId: body.workshopId,
    });
    return newMec;
  }

  async getAllBookings() {
    await delay();
    return [...this.bookings];
  }
}

export const mockStore = new MockState();
