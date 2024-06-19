import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getAllResults } from '../../api/resultsApi';

type Result = {
  resultId: string;
  thumbnail: string;
};

const Results: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResults(page);
  }, [page]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, results]);

  const fetchResults = async (page: number) => {
    try {
      const data = await getAllResults(page);
      setResults(data.resultSet);
    } catch (error) {
      console.error('Error fetching results: ', error);
      Alert.alert('Error', 'Failed to fetch results');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredResults(results);
    } else {
      const filtered = results.filter(result =>
        result.resultId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(filtered);
    }
  };

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
          style={styles.searchBar}
          placeholder="Search results..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => item.resultId}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <Text style={styles.resultText}>{item.resultId}</Text>
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
        <View style={styles.pagination}>
          <Button title="Back" onPress={() => setPage((prev) => Math.max(prev - 1, 1))} />
          <Button title="Next" onPress={() => setPage((prev) => prev + 1)} />
        </View>
      </View>
      <StatusBar backgroundColor="#000000" style="light" />
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
  },
  searchBar: {
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#FFFFFF',
    backgroundColor: '#1E1E1E',
  },
  resultItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
});

export default Results;
