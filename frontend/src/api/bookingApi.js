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
    if (!err.response) {
      console.warn('Backend unavailable, falling back to mock booking store.');
      return mockStore.createBooking(bookingData);
    }
    throw err;
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
    if (!err.response) {
      console.warn('Backend unavailable, falling back to mock booking store.');
      return mockStore.getBookings();
    }
    throw err;
  }
};

export const bookingApi = {
  createBooking,
  getBookings,
};

export default bookingApi;

