// src/api/authApi.ts
import axiosInstance from './axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthResponse {
  token: string;
}

export const login = async (username: string, password: string): Promise<void> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', { username, password });
    console.log('Login successful, storing token:', response.data.token); // Add logging here
    await AsyncStorage.setItem('token', response.data.token);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};
