import React, { useState, useEffect } from 'react';
import { Text, View, Modal, StyleSheet, TextInput } from 'react-native';
import Button from '../components/Button'
import { PaperProvider } from 'react-native-paper';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { useCustomContext } from '../state/context';
import fontColorContrast from 'font-color-contrast'
import * as SecureStore from 'expo-secure-store';

const ChessClock = ({ navigation }) => {

  // Custom context for managing theme
  const { theme, setTheme } = useCustomContext();

  // State for time input, modals, and saving status
  const [time, setTime] = useState(120);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [saving, setSaving] = useState(false);

  // Function to check if a color represents a light background
  const isLightBackground = (color) => {
    // ... implementation details
  };

  // Function to save the time to the theme and SecureStore
  const saveTime = async () => {
    if (isNaN(time)) {
      alert("Time has to be a number")
      return;
    }
    let newTheme = theme;
    newTheme.time = time;
    setTheme(newTheme);
    await SecureStore.setItemAsync("theme", JSON.stringify(newTheme));
  };

  // Callback for color selection in the first modal
  const onSelectColor = async ({ hex }) => {
    let newTheme = theme;
    newTheme.colors = hex;
    setTheme(newTheme);
    await SecureStore.setItemAsync("theme", JSON.stringify(newTheme));
  };

  // Callback for color selection in the second modal
  const onSelectColor2 = async ({ hex }) => {
    let newTheme = theme;
    newTheme.colors2 = hex;
    setTheme(newTheme);
  };

  // Load initial time when the component mounts
  useEffect(() => {
    setTime(theme.time);
  }, []);

  return (
    <PaperProvider>
      {/* Player 1 color change button */}
      <View style={[styles.button, { backgroundColor: theme.colors }]}>
        <View style={[styles.surface]}>
          <Text style={[styles.text, { color: fontColorContrast(theme.colors) }]} onPress={() => setShowModal(true)}>Change color</Text>
          {/* Modal for selecting color */}
          <Modal visible={showModal} animationType='slide'>
            <View style={styles.modal}>
              <ColorPicker style={{ width: '70%' }} value='red' onComplete={onSelectColor}>
                <Preview />
                <Panel1 />
                <HueSlider />
                <OpacitySlider />
                <Swatches />
              </ColorPicker>
              <Button onPress={() => setShowModal(false)} title="OK" />
            </View>
          </Modal>
        </View>
      </View>

      {/* Middle section with information and time input */}
      <View style={styles.middle}>
        <Text style={styles.info}>
          NOTE: Touch the scores when you play.
        </Text>
        <View style={styles.buttons}>
          <Text style={styles.seconds}>Time in seconds: </Text>
          {/* Input for setting time */}
          <TextInput style={styles.input} value={time.toString()} onChangeText={(e) => setTime(e)} label="Set time in seconds" />
          {/* Button to save time */}
          <Button title="Save" onPress={saveTime} disable={!saving} />
        </View>
      </View>

      {/* Player 2 color change button */}
      <View style={[styles.button, { backgroundColor: theme.colors2 }]}>
        <View style={[styles.surface]}>
          <Text style={[styles.text, { color: fontColorContrast(theme.colors2) }]} onPress={() => setShowModal2(true)}>Change color</Text>
          {/* Modal for selecting color */}
          <Modal visible={showModal2} animationType='slide'>
            <View style={styles.modal}>
              <ColorPicker style={{ width: '70%' }} value='red' onComplete={onSelectColor2}>
                <Preview />
                <Panel1 />
                <HueSlider />
                <OpacitySlider />
                <Swatches />
              </ColorPicker>
              <Button onPress={() => setShowModal2(false)} title="OK" />
            </View>
          </Modal>
        </View>
      </View>
    </PaperProvider>
  );
};

export default ChessClock;

const styles = StyleSheet.create({
  button: {
    flex: 5
  },
  middle: {
    flex: 1.4,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    width: 100,
    borderWidth: 1,
    borderColor: "#bbb",
    fontSize: 21,
    padding: 10,
    paddingVertical: 5,
    marginRight: 20,
    borderRadius: 5
  },
  text: {
    fontSize: 28,
    fontFamily: "Helvetica"
  },
  info: {
    fontSize: 14,
    fontFamily: "Helvetica",
    marginBottom: 10,
    textAlign: "center"
  },
  surface: {
    flex: 1, height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  reverseText: {
    transform: [{ rotate: '180deg' }]
  },
  clock: {
    fontFamily: "Helvetica"
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  seconds: {
    fontSize: 15,
    marginRight: 10
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
