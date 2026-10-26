import axiosClient from './axiosClient';
import { mockStore } from './mockData';

const isMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

export const signup = async (payloadOrName, email, password) => {
  const payload = typeof payloadOrName === 'object' && payloadOrName !== null
    ? payloadOrName
    : { name: payloadOrName, email, password };

  const nameVal = payload.name;
  const emailVal = payload.email;
  const passVal = payload.password;

  if (isMock) {
    return mockStore.signup(nameVal, emailVal, passVal);
  }
  try {
    const response = await axiosClient.post('/auth/signup', payload);
    return response.data;
  } catch (err) {
    if (!err.response) {
      console.warn('Backend unavailable, falling back to mock authentication store.');
      return mockStore.signup(nameVal, emailVal, passVal);
    }
    throw err;
  }
};

export const login = async (payloadOrEmail, password) => {
  const payload = typeof payloadOrEmail === 'object' && payloadOrEmail !== null
    ? payloadOrEmail
    : { email: payloadOrEmail, password };

  const emailVal = payload.email;
  const passVal = payload.password;

  if (isMock) {
    return mockStore.login(emailVal, passVal);
  }
  try {
    const response = await axiosClient.post('/auth/login', payload);
    return response.data;
  } catch (err) {
    if (!err.response) {
      console.warn('Backend unavailable, falling back to mock authentication store.');
      return mockStore.login(emailVal, passVal);
    }
    throw err;
  }
};

export const authApi = {
  signup,
  login,
};

export default authApi;

