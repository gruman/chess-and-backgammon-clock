import React, { useState, useEffect } from 'react';
import { Text, View, Modal, StyleSheet, TextInput, Switch } from 'react-native';
import Button from '../components/Button'
import { PaperProvider } from 'react-native-paper';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { useCustomContext } from '../state/context';
import fontColorContrast from 'font-color-contrast'
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const ChessClock = () => {

  const navigation = useNavigation()

  // Custom context for managing theme
  const { theme, setTheme } = useCustomContext();
  // State for time input, modals, and saving status
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0)
  const [delayTime, setDelayTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [diceMode, setDiceMode] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [decimal, setDecimal] = useState(true);
  const [saved, setSaved] = useState(false);
  const toggleSwitch = () => setDiceMode(previousState => !previousState);
  const toggleSwitch2 = () => setHaptics(previousState => !previousState);
  const toggleSwitch3 = () => setDecimal(previousState => !previousState);


  const saveTime = async () => {
    if (isNaN(minutes) || isNaN(seconds) || (minutes < 1 && seconds < 0) || isNaN(delayTime) || delayTime < 0) {
      alert("Time has to be a positive number")
      return;
    }
    //setSaved(true);
    let newTheme = theme;
    newTheme.time = minutes * 60 + seconds;
    newTheme.delay = delayTime;
    newTheme.diceMode = diceMode;
    newTheme.haptics = haptics;
    newTheme.decimal = decimal;
    setTheme(newTheme);
    await SecureStore.setItemAsync("theme", JSON.stringify(newTheme));
    // setTimeout(() => {
    //   setSaved(false)
    // }, 1000)
    navigation.navigate('Home')
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
    const totalSeconds = theme.time;

    // Now you can set the state variables
    setMinutes(Math.floor(totalSeconds / 60));
    setSeconds(totalSeconds % 60);
    setDelayTime(theme.delay)
    setDiceMode(theme.diceMode)
    setHaptics(theme.haptics)
  }, [theme]);

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
          Touch the scores when you play. Time is measured to 1/10th of a second. Dice are ramdomized with Javascript's Math.random.
        </Text>
        <View style={styles.middleSection}>
          <View style={{justifyContent: "center"}}>
            
            <Text style={styles.seconds}>Time (mm:ss): </Text>
            {/* Input for setting time */}
            <View style={[styles.buttons, {justifyContent: "flex-start"}]}>
            <TextInput style={styles.input} value={minutes.toString()} onChangeText={(e) => setMinutes(e)} label="Set time in seconds" />
            <Text style={styles.seconds}>:</Text>
            <TextInput style={[styles.input]} value={seconds.toString()} onChangeText={(e) => setSeconds(e)} label="Set time in seconds" />
</View>
            <Text style={styles.seconds}>Delay in seconds: </Text>
            {/* Input for setting time */}
            <TextInput style={[styles.input, {marginTop: 5}]} value={delayTime.toString()} onChangeText={(e) => setDelayTime(e)} label="Set delay in seconds" />
          </View>
          <View style={{alignItems: "flex-end", justifyContent: "center"}}>
            <View style={styles.buttons}>
              <Text style={styles.seconds}>Dice mode: </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#60D838' }}
                thumbColor={diceMode ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={diceMode}
              /></View>
            <View style={styles.buttons}>
              <Text style={[styles.seconds]}>Haptics: </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#60D838' }}
                thumbColor={diceMode ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch2}
                value={haptics}
              /></View>
              <View style={styles.buttons}>
            <Text style={[styles.seconds]}>Decimal: </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#60D838' }}
              thumbColor={diceMode ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch3}
              value={decimal}
            /></View>
            </View>
        </View>
        <Button title="Save" onPress={saveTime} />
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
    flex: 4
  },
  middle: {
    flex: 7,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    width:80,
    borderWidth: 1,
    borderColor: "#bbb",
    fontSize: 28,
    padding: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5
  },
  text: {
    fontSize: 28,
    fontFamily: "Helvetica"
  },
  info: {
    fontSize:18,
    fontFamily: "Helvetica",
    textAlign: "left"
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
    flexDirection: "row",
    marginVertical: 10,
  },
  middleSection: {
    padding: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  buttons1: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
  },
  seconds: {
    fontSize: 16,
    marginRight: 5
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
