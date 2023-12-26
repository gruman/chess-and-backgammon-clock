import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import Button from '../components/Button'
import { useIsFocused } from "@react-navigation/native";
import { PaperProvider } from 'react-native-paper';
import { useCustomContext } from '../state/context';
import fontColorContrast from 'font-color-contrast'
import * as Haptics from 'expo-haptics';
import { FontAwesome5 } from '@expo/vector-icons';

const ChessClock = ({ navigation }) => {


const icons = [
  'dice-one',
  'dice-two',
  'dice-three',
  'dice-four',
  'dice-five',
  'dice-six',
]
  
  // Extracting state and functions from custom context
  const { theme, score1, setScore1, setScore2, score2 } = useCustomContext();

  // Hook to check if the screen is currently focused
  const isVisible = useIsFocused();

  // Local state for player times, current player, and pause status
  const [player1Time, setPlayer1Time] = useState(120);
  const [player2Time, setPlayer2Time] = useState(120);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [paused, setPaused] = useState(false);
  const [roll, setRoll] = useState([6, 6])
  const [delayTime, setDelayTime] = useState(theme.delay)
  const [iconDice, setIconDice] = useState([6, 6])


  // Alert game over when either player's time reaches 0
  useEffect(() => {
    let interval;

    const updateClock = () => {
      if (!paused && delayTime < 1) {
        if (currentPlayer === 1 && player1Time > 0) {
          setPlayer1Time((prevTime) => prevTime - 0.1);
        } else if (currentPlayer === 2 && player2Time > 0) {
          setPlayer2Time((prevTime) => prevTime - 0.1);
        }
      }
    };

    interval = setInterval(updateClock, 100);

    return () => {
      clearInterval(interval);
    };
  }, [currentPlayer, paused, player1Time, player2Time, delayTime]);


  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      if (!paused) {
      setDelayTime(old => old - 1)
      }
    }, 1000)
    return () => {
      clearInterval(interval);
    };
  }, [currentPlayer, paused, delayTime]);

  
  // Function to format time in MM:SS format
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingMilliseconds = Math.round((seconds % 1) * 1000); // Extract rounded milliseconds
    const formattedSeconds = String(Math.floor(seconds % 60)).padStart(2, '0'); // Ensure two-digit formatting for seconds
    const tenths = Math.floor(remainingMilliseconds / 100); // Extract rounded hundredths of a second
    if (theme.decimal) {
    return (
      <Text>
        {minutes}:{formattedSeconds}<Text style={{ fontSize: 30 }}>:{tenths}</Text>
      </Text>
    );
    }
    else {
        return (
          <Text>
            {minutes}:{formattedSeconds}
          </Text>
        )
    }
  }
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
  // Function to toggle between players and start the clock
  function togglePlayers(id) {
    const dice1 = getRandomInt(1, 7);
    const dice2 = getRandomInt(1, 7);
    if (theme.haptics) {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    }
    setRoll([dice1, dice2]);
    setIconDice([dice1, dice2]);
    setPaused(false)
    setDelayTime(theme.delay);
    setCurrentPlayer(id)
  }

  // Function to pause/unpause the clock
  function pause() {
    setPaused(old => !old)
  }

  // Load initial theme and player times when the screen becomes visible
  useEffect(() => {
    setPlayer1Time(theme.time)
    setPlayer2Time(theme.time)
    setDelayTime(theme.delay)

  }, [isVisible, theme])

  // Function to reset the game
  function resetGame() {
    setPaused(false);
    setPlayer1Time(theme.time)
    setPlayer2Time(theme.time)
    setScore1(0);
    setScore2(0)
    setCurrentPlayer(0)
  }

  return (
    <>
      {/* Player 1 clock */}
      <View style={[styles.button, { backgroundColor: theme.colors, opacity: currentPlayer === 1 ? 0.9 : 1 }]}>
        <Pressable disabled={currentPlayer === 2} onPress={() => currentPlayer == 0 ? togglePlayers(1) : togglePlayers(2)} style={{ flex: 1 }}>
          <View style={[styles.surface]}>
          {
              theme.diceMode && currentPlayer === 1 &&
             <View style={styles.diceHolder}>
                <FontAwesome5 style={{margin: 5}} name= {icons[roll[0] - 1]} size={50} color={fontColorContrast(theme.colors)} />
                <FontAwesome5 style={{margin: 5}} name= {icons[roll[1] - 1]} size={50} color={fontColorContrast(theme.colors)} />
            </View>

          }
       <Text style={[styles.reverseText, styles.clock, { color: fontColorContrast(theme.colors) }]}>{formatTime(player1Time)}</Text>
            {
              delayTime > 0 && currentPlayer === 1 &&
              <Text style={[styles.diceText, styles.reverseText, { color: fontColorContrast(theme.colors) }]}>{delayTime}</Text>
            }
          </View>
        </Pressable>
      </View>

      {/* Middle section with scores, buttons, and player 2 clock */}
      <View style={styles.middle}>
        <View style={styles.buttons}>
          {/* Player 2 score button */}
          <Pressable onPress={() => setScore2(old => old + 1)} style={[styles.score, { backgroundColor: theme.colors }]}>
            <Text style={[styles.scoreText, styles.left, { color: fontColorContrast(theme.colors) }]}>{score2 ? score2 : 0}</Text>
          </Pressable>

          {/* Buttons for pause/reset or navigate to settings/reset based on the current player */}
          {
            paused ?
              <>
                <Button style={{ marginRight: 10 }} onPress={() => pause()} title="Pause" />
                <Button style={{ marginLeft: 10 }} onPress={() => resetGame()} title="Reset" />
              </>
              :
              currentPlayer !== 0 ?
                <>
                  <Button style={{ marginRight: 10 }} onPress={() => pause()} title="Pause" />
                </>
                :
                <>
                  <Button style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Settings')} title="Settings" />
                </>
          }

          {/* Player 1 score button */}
          <Pressable onPress={() => setScore1(old => old + 1)} style={[styles.score, { backgroundColor: theme.colors2 }]}>
            <Text style={[styles.scoreText, styles.right, { color: fontColorContrast(theme.colors2) }]}>{score1 ? score1 : 0}</Text>
          </Pressable>
        </View>
      </View>

      {/* Player 2 clock */}
      <View style={[styles.button, { backgroundColor: theme.colors2, opacity: currentPlayer === 2 ? 0.9 : 1 }]}>
        <Pressable disabled={currentPlayer === 1} onPress={() => currentPlayer == 0 ? togglePlayers(2) : togglePlayers(1)} style={{ flex: 1 }}>
          <View style={[styles.surface]}>
            {
              theme.diceMode && currentPlayer === 2 &&
            
            <View style={styles.diceHolder}>
                {/* <Text style={[styles.diceText, { color: fontColorContrast(theme.colors2) }]}>{roll[0]}</Text> */}
                <FontAwesome5 style={{margin: 5}} name= {icons[roll[0] - 1]} size={50} color={fontColorContrast(theme.colors2)} />
             
                <FontAwesome5 style={{margin: 5}} name= {icons[roll[1] - 1]} size={50} color={fontColorContrast(theme.colors2)} />
             
            </View>
}
            <Text style={[styles.clock, { color: fontColorContrast(theme.colors2) }]}>{formatTime(player2Time)}</Text>
            {
              delayTime > 0 && currentPlayer === 2 &&
              <Text style={[styles.diceText, { color: fontColorContrast(theme.colors2) }]}>{delayTime}</Text>
            }
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default ChessClock;

const styles = StyleSheet.create({
  button: {
    flex: 5,
  },
  diceHolder: {
    flexDirection: "row",
  },
  middle: {
    flex: 0.7,
    width: "100%",
    backgroundColor: '#111'
  },
  dice: {
    margin: 10,
    marginHorizontal: 5,
    borderWidth: 3,
    borderRadius: 10,
    height: 50,
    width: 50,
    borderColor: '#fff',
    justifyContent: "center",
    alignItems: "center"
  },
  diceText: {

    fontFamily: "Helvetica",
    fontSize: 32,
  },
  score: {
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    flex: 1
  },
  scoreText: {
    fontSize: 21,
    color: "#fff",
    fontFamily: "Helvetica",
    fontWeight: 700,
  },
  input: {
    width: 300,
  },
  surface: {
    flex: 1, height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  reverseText: {
    transform: [{ rotate: '180deg' }]
  },
  clock: {
    fontFamily: "Helvetica",
    fontSize: 75
  },
  buttons: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  left: {
    transform: [{ rotate: '90deg' }]
  },
  right: {
    transform: [{ rotate: '-90deg' }]
  }
})
