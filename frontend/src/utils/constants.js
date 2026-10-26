export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  MECHANIC: 'MECHANIC',
  ADMIN: 'ADMIN',
};

export const CATEGORIES = [
  { value: 'TWO_WHEELER', label: '2-Wheeler' },
  { value: 'THREE_WHEELER', label: '3-Wheeler' },
  { value: 'FOUR_WHEELER', label: '4-Wheeler' },
  { value: 'HEAVY', label: 'Heavy Vehicles' },
];

export const SUB_TYPES = {
  TWO_WHEELER: ['Geared', 'Scooter', 'EV'],
  THREE_WHEELER: ['CNG', 'Petrol'],
  FOUR_WHEELER: ['Petrol', 'CNG', 'Diesel', 'EV'],
  HEAVY: ['DEFAULT'],
};

export const JOB_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const QUEUE_CLASS = {
  SHORT: 'SHORT',
  LONG: 'LONG',
};
