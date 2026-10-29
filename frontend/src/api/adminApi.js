import axiosClient from './axiosClient';
import { mockStore } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

export const getWorkshops = async () => {
  if (isMock) {
    return mockStore.getWorkshops();
  }
  try {
    const response = await axiosClient.get('/admin/workshops');
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock workshops store.', err);
    return mockStore.getWorkshops();
  }
};

export const addWorkshop = async (body) => {
  if (isMock) {
    return mockStore.addWorkshop(body);
  }
  try {
    const response = await axiosClient.post('/admin/workshops', body);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock workshops store.', err);
    return mockStore.addWorkshop(body);
  }
};

export const createWorkshop = addWorkshop;

export const getMechanics = async () => {
  if (isMock) {
    return mockStore.getMechanics();
  }
  try {
    const response = await axiosClient.get('/admin/mechanics');
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock mechanics store.', err);
    return mockStore.getMechanics();
  }
};

export const addMechanic = async (body) => {
  if (isMock) {
    return mockStore.addMechanic(body);
  }
  try {
    const response = await axiosClient.post('/admin/mechanics', body);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock mechanics store.', err);
    return mockStore.addMechanic(body);
  }
};

export const createMechanic = addMechanic;

export const getAllBookings = async () => {
  if (isMock) {
    return mockStore.getAllBookings();
  }
  try {
    const response = await axiosClient.get('/admin/bookings');
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock bookings store.', err);
    return mockStore.getAllBookings();
  }
};

export const adminApi = {
  getWorkshops,
  addWorkshop,
  createWorkshop,
  getMechanics,
  addMechanic,
  createMechanic,
  getAllBookings,
};

export default adminApi;
