import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TravelContext } from './TravelContext.shared';
import { travelApi } from '../api/travelApi';

export const TravelProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState(() => {
    try {
      const cached = localStorage.getItem('travelai_current_trip');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [savedTrips, setSavedTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const fetchSavedTrips = useCallback(async () => {
    try {
      const data = await travelApi.getSavedTrips();
      setSavedTrips(data || []);
    } catch (err) {
      console.warn('Could not load saved trips:', err.message);
    }
  }, []);

  // Sync current trip with localStorage
  useEffect(() => {
    if (currentTrip) {
      try {
        localStorage.setItem('travelai_current_trip', JSON.stringify(currentTrip));
      } catch (_err) {
        console.error('Storage error:', _err);
      }
    }
  }, [currentTrip]);

  // Load saved trips on mount
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    fetchSavedTrips();
  }, [fetchSavedTrips]);

  const planTrip = async (formData) => {
    setIsLoading(true);
    setError(null);
    setLoadingStage('Analyzing flight corridors & destination geography...');

    const stages = [
      'Scanning local seasonal weather & optimal travel windows...',
      'Curating authentic dining spots & hidden culinary gems...',
      'Balancing morning, afternoon, and evening pacing...',
      'Calculating intelligent budget distribution & expense estimates...',
      'Assembling high-fidelity day-by-day itinerary...'
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setLoadingStage(stages[stageIdx]);
    }, 2200);

    try {
      const tripData = await travelApi.planTrip(formData);
      clearInterval(interval);
      setCurrentTrip(tripData);
      setIsLoading(false);
      
      // Trigger subtle celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      return tripData;
    } catch (err) {
      clearInterval(interval);
      setIsLoading(false);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to generate travel plan. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const regenerateDay = async (dayNumber, customPrompt = '') => {
    if (!currentTrip) return;
    setIsLoading(true);
    setLoadingStage(`Regenerating Day ${dayNumber} with personalized experiences...`);

    try {
      const updatedTrip = await travelApi.regenerateDay({
        trip_id: currentTrip.id,
        trip_context: currentTrip,
        day_number: dayNumber,
        custom_prompt: customPrompt
      });
      setCurrentTrip(updatedTrip);
      setIsLoading(false);
      return updatedTrip;
    } catch (err) {
      setIsLoading(false);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to regenerate day.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const modifyTrip = async (instruction) => {
    if (!currentTrip) return;
    setIsLoading(true);
    setLoadingStage(`Applying your modifications: "${instruction}"...`);

    try {
      const modified = await travelApi.modifyTrip({
        trip_id: currentTrip.id,
        current_trip: currentTrip,
        modification_instruction: instruction
      });
      setCurrentTrip(modified);
      setIsLoading(false);
      return modified;
    } catch (err) {
      setIsLoading(false);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to modify trip.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const saveCurrentTrip = async (customTitle, customNotes) => {
    if (!currentTrip) return;
    try {
      const res = await travelApi.saveTrip({
        trip_data: currentTrip,
        title: customTitle || `${currentTrip.duration_days}-Day Trip to ${currentTrip.destination}`,
        notes: customNotes || ''
      });
      
      setCurrentTrip(prev => prev ? { ...prev, is_saved: true, id: res.trip_id || prev.id } : null);
      await fetchSavedTrips();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      return res;
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'Failed to save trip.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const deleteSavedTrip = async (tripId) => {
    try {
      await travelApi.deleteTrip(tripId);
      setSavedTrips(prev => prev.filter(t => t.id !== tripId));
      if (currentTrip?.id === tripId) {
        setCurrentTrip(prev => prev ? { ...prev, is_saved: false } : null);
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'Failed to delete trip.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const loadTrip = async (tripId) => {
    setIsLoading(true);
    setError(null);
    setLoadingStage('Loading trip itinerary details...');
    try {
      const trip = await travelApi.getTripById(tripId);
      setCurrentTrip(trip);
      setIsLoading(false);
      return trip;
    } catch (err) {
      setIsLoading(false);
      const errMsg = err.response?.data?.detail || err.message || 'Could not load trip.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  return (
    <TravelContext.Provider
      value={{
        currentTrip,
        setCurrentTrip,
        savedTrips,
        isLoading,
        loadingStage,
        error,
        setError,
        isAiChatOpen,
        setIsAiChatOpen,
        planTrip,
        regenerateDay,
        modifyTrip,
        saveCurrentTrip,
        deleteSavedTrip,
        loadTrip,
        fetchSavedTrips
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};
