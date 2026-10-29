import axiosClient from './axiosClient';
import { mockStore } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

export const createBooking = async (bookingData) => {
  if (isMock) {
    return mockStore.createBooking(bookingData);
  }
  try {
    const response = await axiosClient.post('/bookings', bookingData);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock booking store.', err);
    return mockStore.createBooking(bookingData);
  }
};

export const getBookings = async () => {
  if (isMock) {
    return mockStore.getBookings();
  }
  try {
    const response = await axiosClient.get('/bookings');
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock booking store.', err);
    return mockStore.getBookings();
  }
};

export const bookingApi = {
  createBooking,
  getBookings,
};

export default bookingApi;

