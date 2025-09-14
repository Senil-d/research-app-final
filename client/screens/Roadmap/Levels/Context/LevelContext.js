import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LevelContext = createContext();

export const LevelProvider = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    const loadLevel = async () => {
      try {
        const storedLevel = await AsyncStorage.getItem('currentLevel');
        if (storedLevel !== null) {
          setCurrentLevel(parseInt(storedLevel, 10));
        }
      } catch (error) {
        console.error('Error loading level from storage:', error);
      }
    };
    loadLevel();
  }, []);

  const updateLevel = async (newLevel) => {
    try {
      setCurrentLevel(newLevel);
      await AsyncStorage.setItem('currentLevel', newLevel.toString());
    } catch (error) {
      console.error('Error updating level in storage:', error);
    }
  };

  return (
    <LevelContext.Provider value={{ currentLevel, updateLevel }}>
      {children}
    </LevelContext.Provider>
  );
};