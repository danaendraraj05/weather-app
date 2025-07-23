// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';


export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const [locationLoading, setLocationLoading] = useState(false);

  const API_KEY = Constants.expoConfig.extra.WEATHER_API_KEY; 

const fetchWeather = async () => {
  if (!city.trim()) return;
  setLoading(true);
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    setWeather(response.data);
  } catch (err) {
    console.error('API error:', err?.response?.data || err.message);
    alert('Error: ' + (err?.response?.data?.message || 'Unknown error'));
  } finally {
    setLoading(false);
  }
};

const handleUseCurrentLocation = async () => {
  try {
    setLocationLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required.');
      setLocationLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    fetchWeatherByCoordinates(latitude, longitude);
  } catch (error) {
    Alert.alert('Error', 'Could not fetch location.');
    console.error(error);
  } finally {
    setLocationLoading(false);
  }
};

const fetchWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      setWeather(data);
    } else {
      Alert.alert('Error', 'City not found.');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Failed to fetch weather.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Weather App 🌤️</Text>
      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Get Weather" onPress={fetchWeather} />
        <View style={{ height: 10 }} />
        <Button
          title={locationLoading ? 'Locating...' : 'Use Current Location'}
          onPress={handleUseCurrentLocation}
          disabled={locationLoading}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {weather && (
        <View style={styles.result}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{weather.main.temp}°C</Text>
          <Text>{weather.weather[0].description}</Text>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.emoji}>🌡️</Text>
              <Text style={styles.label}>Feels like</Text>
              <Text style={styles.value}>{weather.main.feels_like}°C</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.emoji}>💧</Text>
              <Text style={styles.label}>Humidity</Text>
              <Text style={styles.value}>{weather.main.humidity}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.emoji}>📈</Text>
              <Text style={styles.label}>Pressure</Text>
              <Text style={styles.value}>{weather.main.pressure} hPa</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.emoji}>🌬️</Text>
              <Text style={styles.label}>Wind</Text>
              <Text style={styles.value}>{weather.wind.speed} m/s</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.emoji}>☁️</Text>
              <Text style={styles.label}>Clouds</Text>
              <Text style={styles.value}>{weather.clouds.all}%</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.emoji}>👀</Text>
              <Text style={styles.label}>Visibility</Text>
              <Text style={styles.value}>{weather.visibility / 1000} km</Text>
            </View>
          </View>

      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 80, backgroundColor: '#f0f4f8' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  city: { fontSize: 22, fontWeight: 'bold' },
  temp: { fontSize: 40, fontWeight: '600', marginVertical: 10 },
  result: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },
  desc: {
    textTransform: 'capitalize',
    marginBottom: 10,
    color: '#555',
  },
  grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 20,
  },
  gridItem: {
    width: '30%',
    backgroundColor: '#e8f4f8',
    paddingVertical: 10,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  buttonContainer: {
  marginVertical: 10,
},


});
