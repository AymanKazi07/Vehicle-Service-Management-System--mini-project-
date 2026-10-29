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
    console.warn('Backend unavailable or error, falling back to mock bill store.', err);
    return mockStore.getBill(bookingId);
  }
};

export const billApi = {
  getBill,
};

export default billApi;
