import axiosInstance from './axiosInstance';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImageItem {
  uploadId: string;
  uri: string;
}

interface UploadImageResponse {
  message: string;
  imagePath: string;
}

const getToken = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    await AsyncStorage.setItem('token', token);
    return token;
  }
  return null;
};

export const uploadImage = async (userId: string, uploadId: string, imageUri: string): Promise<UploadImageResponse> => {
  const formData = new FormData();
  const response = await fetch(imageUri);
  const blob = await response.blob();
  formData.append('image', blob, `${uploadId}.jpg`);

  try {
    const token = await getToken();
    const res = await axiosInstance.post<UploadImageResponse>(`/images/user/${userId}/images/uploadImage/${uploadId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

export const updateImage = async (userId: string, uploadId: string, imageUri: string): Promise<UploadImageResponse> => {
  const formData = new FormData();
  const response = await fetch(imageUri);
  const blob = await response.blob();
  formData.append('image', blob, `${uploadId}.jpg`);

  try {
    const token = await getToken();
    const res = await axiosInstance.put<UploadImageResponse>(`/images/user/${userId}/images/updateImage/${uploadId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

export const downloadImage = async (userId: string, uploadId: string): Promise<string> => {
  try {
    const token = await getToken();
    const res = await axiosInstance.get<{ imagePath: string }>(`/images/user/${userId}/images/downloadImage/${uploadId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.data.imagePath;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

export const getAllImages = async (userId: string): Promise<ImageItem[]> => {
  try {
    const token = await getToken();
    const res = await axiosInstance.get<ImageItem[]>(`/images/user/${userId}/images/allImages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Raw response data:', res.data); // Log the raw response data

    // Logging each uploadId and uri
    res.data.forEach(image => {
      console.log('uploadId:', image.uploadId);
      console.log('uri:', image.uri);
    });

    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

export const deleteImage = async (userId: string, uploadId: string): Promise<{ message: string }> => {
  try {
    const token = await getToken();
    const res = await axiosInstance.delete<{ message: string }>(`/images/user/${userId}/images/deleteImage/${uploadId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

export const deleteAllImages = async (userId: string): Promise<{ message: string }> => {
  try {
    const token = await getToken();
    const res = await axiosInstance.delete<{ message: string }>(`/images/user/${userId}/images/deleteAllImages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};
