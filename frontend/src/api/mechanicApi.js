import axiosClient from './axiosClient';
import { mockStore } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

export const getJobs = async () => {
  if (isMock) {
    return mockStore.getJobs();
  }
  try {
    const response = await axiosClient.get('/mechanic/jobs');
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock jobs store.', err);
    return mockStore.getJobs();
  }
};

export const updateJobStatus = async (jobId, statusOrBody, maybeNotes) => {
  const body = typeof statusOrBody === 'object' && statusOrBody !== null
    ? statusOrBody
    : { status: statusOrBody, notes: maybeNotes };

  if (isMock) {
    return mockStore.updateJobStatus(jobId, body.status, body.notes);
  }
  try {
    const response = await axiosClient.patch(`/mechanic/jobs/${jobId}/status`, body);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or error, falling back to mock jobs store.', err);
    return mockStore.updateJobStatus(jobId, body.status, body.notes);
  }
};

export const mechanicApi = {
  getJobs,
  updateJobStatus,
};

export default mechanicApi;
