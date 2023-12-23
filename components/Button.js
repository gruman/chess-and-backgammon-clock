import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

// Button component with onPress event, title, and optional color prop
const Button = ({ onPress, title, color = "black" }) => {
  return (
    // Pressable component with onPress event and styling
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
      {/* Text component for the button title with styling */}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

// Styles for the Button component
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111', // Default background color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white', // Default text color
    fontSize: 16,
    textTransform: "uppercase", // Uppercase text
  },
});

export default Button;
