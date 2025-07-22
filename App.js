// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

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


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Weather App 🌤️</Text>
      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <Button title="Get Weather" onPress={fetchWeather} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {weather && (
        <View style={styles.result}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{weather.main.temp}°C</Text>
          <Text>{weather.weather[0].description}</Text>
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
  result: { marginTop: 30, alignItems: 'center' },
  city: { fontSize: 22, fontWeight: 'bold' },
  temp: { fontSize: 40, fontWeight: '600', marginVertical: 10 },
});
