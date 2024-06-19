import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, ActivityIndicator, Pressable, Alert, Modal, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../../firebase';
import { uploadImage, updateImage, getAllImages, downloadImage, deleteImage, deleteAllImages } from '../../api/imageApi';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

type ImageItem = {
  uploadId: string;
  uri: string;
};

const Upload: React.FC = () => {
  const userId = auth.currentUser?.uid;
  const [uploadId, setUploadId] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<{ id: string, isEdit: boolean } | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  useEffect(() => {
    if (!userId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User not authenticated.',
      });
      return;
    }
    fetchImages();
  }, [userId]);

  const pickImage = async (id?: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      if (id) {
        setEditMode({ id, isEdit: true });
      }
    }
  };

  const handleUpload = useCallback(async () => {
    if (!uploadId || !selectedImage || !userId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please provide an upload ID and select an image.',
      });
      return;
    }

    try {
      setLoading(true);
      await uploadImage(userId, uploadId, selectedImage.uri);
      fetchImages();
      setSelectedImage(null);
      setUploadId('');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Image uploaded successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [userId, uploadId, selectedImage]);

  const handleUpdate = useCallback(async () => {
    if (!selectedImage || !userId || !editMode) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select an image to update.',
      });
      return;
    }

    try {
      setLoading(true);
      await updateImage(userId, editMode.id, selectedImage.uri);
      setImages((prevImages) => 
        prevImages.map((image) => 
          image.uploadId === editMode.id ? { ...image, uri: selectedImage.uri } : image
        )
      );
      setSelectedImage(null);
      setEditMode(null);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Image updated successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [userId, selectedImage, editMode]);

  const handleDelete = useCallback(async (id: string) => {
    if (!userId) return;

    try {
      setLoading(true);
      await deleteImage(userId, id);
      setImages((prevImages) => prevImages.filter((image) => image.uploadId !== id));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Image deleted successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleDeleteAll = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      await deleteAllImages(userId);
      setImages([]);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'All images deleted successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
      setShowDeleteAllModal(false);
    }
  }, [userId]);

  const handleDownload = useCallback(async (id: string) => {
    if (!userId) return;

    try {
      const imagePath = await downloadImage(userId, id);
      const localUri = FileSystem.documentDirectory + `${id}.jpg`;

      if (Platform.OS !== 'web') {
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
          Toast.show({
            type: 'info',
            text1: 'Info',
            text2: 'Image already exists on your device.',
          });
          return;
        }

        await FileSystem.downloadAsync(imagePath, localUri);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Image downloaded successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Downloading is not supported on web.',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  }, [userId]);

  const fetchImages = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const images = await getAllImages(userId);
      setImages(images);
      console.log('Fetch all images successful:', images);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/previews/005/867/120/non_2x/black-and-white-alphabet-h-letter-logo-icon-with-wings-design-creative-template-for-company-and-business-vector.jpg",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.container}>
        <TextInput
          placeholder="Upload ID Name"
          style={styles.input}
          placeholderTextColor="#C0C0C0"
          value={uploadId}
          onChangeText={setUploadId}
        />
        <Pressable style={styles.button} onPress={() => pickImage()}>
          <Text style={styles.buttonText}>Select Image</Text>
        </Pressable>
        {selectedImage && <Text style={styles.imageSelectedText}>Image selected</Text>}
        <Pressable style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </Pressable>
        {editMode && (
          <Pressable style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Image</Text>
          </Pressable>
        )}
        {loading && <ActivityIndicator size="large" color="#00ff00" />}
        <FlatList
          data={images}
          keyExtractor={(item) => item.uploadId}
          renderItem={({ item }) => (
            <View style={styles.imageItem}>
              <Image source={{ uri: item.uri }} style={styles.imageThumbnail} />
              <Text style={styles.imageId}>{item.uploadId}</Text>
              <Pressable onPress={() => pickImage(item.uploadId)}>
                <FontAwesome name="pencil" style={styles.editIcon} />
              </Pressable>
              <Pressable onPress={() => handleDelete(item.uploadId)}>
                <MaterialIcons name="delete" style={styles.deleteIcon} />
              </Pressable>
              <Pressable onPress={() => handleDownload(item.uploadId)}>
                <FontAwesome name="download" style={styles.downloadIcon} />
              </Pressable>
            </View>
          )}
        />
        <Pressable style={styles.button} onPress={() => setShowDeleteAllModal(true)}>
          <Text style={styles.buttonText}>Delete All Images</Text>
        </Pressable>
      </View>
      <StatusBar backgroundColor="#000000" style="light" />

      <Modal
        transparent={true}
        visible={showDeleteAllModal}
        onRequestClose={() => setShowDeleteAllModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete all images?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowDeleteAllModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleDeleteAll}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
    fontWeight: '400',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  imageSelectedText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  imageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
  },
  imageThumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  imageId: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  editIcon: {
    color: '#FFD700',
    fontSize: 24,
    marginRight: 10,
  },
  deleteIcon: {
    color: '#FF4500',
    fontSize: 24,
    marginRight: 10,
  },
  downloadIcon: {
    color: '#00BFFF',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: '#CCCCCC',
  },
  modalConfirmButton: {
    backgroundColor: '#FF4500',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Upload;
