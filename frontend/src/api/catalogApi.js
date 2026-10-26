import axiosClient from './axiosClient';
import { mockStore } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

export const getServices = async (category, subType) => {
  if (isMock) {
    return mockStore.getServices(category, subType);
  }
  const params = {};
  if (category) params.category = category;
  if (subType) params.subType = subType;
  try {
    const response = await axiosClient.get('/services', { params });
    return response.data;
  } catch (err) {
    if (!err.response) {
      console.warn('Backend unavailable, falling back to mock catalog store.');
      return mockStore.getServices(category, subType);
    }
    throw err;
  }
};

export const updateService = async (id, body) => {
  if (isMock) {
    return mockStore.updateService(id, body);
  }
  try {
    const response = await axiosClient.put(`/admin/services/${id}`, body);
    return response.data;
  } catch (err) {
    if (!err.response) {
      console.warn('Backend unavailable, falling back to mock catalog store.');
      return mockStore.updateService(id, body);
    }
    throw err;
  }
};

export const catalogApi = {
  getServices,
  updateService,
};

export default catalogApi;

