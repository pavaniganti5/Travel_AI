import axios from 'axios';

const configuredApiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api')
  .replace(/\/+$/, '');
const API_BASE_URL = configuredApiUrl.endsWith('/api')
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s for AI generation
});

export const travelApi = {
  // Generate brand new trip itinerary
  planTrip: async (payload) => {
    const response = await apiClient.post('/travel/plan', payload);
    return response.data;
  },

  planFromVoice: async (payload) => {
    const response = await apiClient.post('/travel/voice', payload);
    return response.data;
  },

  speak: async (text) => {
    const response = await apiClient.post('/travel/speak', { text });
    return response.data;
  },

  // Regenerate a single day with optional custom prompt
  regenerateDay: async (payload) => {
    const response = await apiClient.post('/travel/regenerate-day', payload);
    return response.data;
  },

  // Modify the entire itinerary using natural language instructions
  modifyTrip: async (payload) => {
    const response = await apiClient.post('/travel/modify', payload);
    return response.data;
  },

  // Conversational AI travel assistant
  chatAssistant: async (payload) => {
    const response = await apiClient.post('/travel/chat', payload);
    return response.data;
  },

  // Save trip to database
  saveTrip: async (payload) => {
    const response = await apiClient.post('/travel/save', payload);
    return response.data;
  },

  // Get list of saved itineraries
  getSavedTrips: async () => {
    const response = await apiClient.get('/travel/saved');
    return response.data;
  },

  // Get single trip by ID
  getTripById: async (tripId) => {
    const response = await apiClient.get(`/travel/${tripId}`);
    return response.data;
  },

  // Delete saved trip
  deleteTrip: async (tripId) => {
    const response = await apiClient.delete(`/travel/${tripId}`);
    return response.data;
  },

  // System Health
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default travelApi;
