import axiosClient from './axiosClient';
import { mockStore } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

export const getVehicles = async () => {
  if (isMock) {
    return mockStore.getVehicles();
  }
  try {
    const response = await axiosClient.get('/vehicles');
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or unauthenticated, falling back to mock vehicle store.', err);
    return mockStore.getVehicles();
  }
};

export const addVehicle = async (vehicleData) => {
  if (isMock) {
    return mockStore.addVehicle(vehicleData);
  }
  try {
    const response = await axiosClient.post('/vehicles', vehicleData);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable, falling back to mock vehicle store.', err);
    return mockStore.addVehicle(vehicleData);
  }
};

export const getHistory = async (regNo) => {
  if (isMock) {
    return mockStore.getHistory(regNo);
  }
  try {
    const response = await axiosClient.get(`/vehicles/${regNo}/history`);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable, falling back to mock vehicle history store.', err);
    return mockStore.getHistory(regNo);
  }
};

export const vehicleApi = {
  getVehicles,
  addVehicle,
  getHistory,
};

export default vehicleApi;
