import axiosClient from './axiosClient';
import { mockStore } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

export const getBill = async (bookingId) => {
  if (isMock) {
    return mockStore.getBill(bookingId);
  }
  try {
    const response = await axiosClient.get(`/bills/${bookingId}`);
    return response.data;
  } catch (err) {
    if (!err.response) {
      console.warn('Backend unavailable, falling back to mock bill store.');
      return mockStore.getBill(bookingId);
    }
    throw err;
  }
};

export const billApi = {
  getBill,
};

export default billApi;
