import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

// Create a context
const Context = createContext();

// Context provider component
export const ContextProvider = ({ children }) => {
  // State for theme and scores
  const [theme, setTheme] = useState({
    colors: "#111",
    colors2: "#881100",
    time: 120,
    delay: 2,
    diceMode: false
  });
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [dice, setDice] = useState(true)
  // Load theme from SecureStore on component mount
  useEffect(() => {
    async function getValueFor(key) {
      try {
        let result = await SecureStore.getItemAsync(key);
        if (result) {
          setTheme(JSON.parse(result));
          console.log(result)
        } else {
          console.log('No values stored under that key.');
        }
      } catch (error) {
        console.error('Error getting value from SecureStore:', error);
      }
    }

    getValueFor("theme");
  }, []);
// Save theme to SecureStore whenever it changes
useEffect(() => {
  const saveTheme = async () => {
    try {
      await SecureStore.setItemAsync("theme", JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving theme to SecureStore:', error);
    }
  }

  saveTheme();
}, [theme]);

  // Provide the context value to the components
  return (
    <Context.Provider value={{ dice, setDice, theme, setTheme, score1, setScore1, score2, setScore2 }}>
      {children}
    </Context.Provider>
  );
};

// Custom hook to consume the context
export const useCustomContext = () => useContext(Context);
