import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import Button from '../components/Button'
import { useIsFocused } from "@react-navigation/native";
import { PaperProvider } from 'react-native-paper';
import { useCustomContext } from '../state/context';
import fontColorContrast from 'font-color-contrast'

const ChessClock = ({ navigation }) => {

  // Extracting state and functions from custom context
  const { theme, setTheme, updateScore, score1, setScore1, setScore2, score2 } = useCustomContext();

  // Hook to check if the screen is currently focused
  const isVisible = useIsFocused();

  // Local state for player times, current player, and pause status
  const [player1Time, setPlayer1Time] = useState(120);
  const [player2Time, setPlayer2Time] = useState(120);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [paused, setPaused] = useState(true);

  // Alert game over when either player's time reaches 0
  useEffect(() => {
    if (player1Time === 0 || player2Time === 0) {
      alert('Game over!');
    }
  }, [player1Time, player2Time]);

  // Timer logic for each player
  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      if (!paused) {
        if (currentPlayer === 1 && player1Time > 0) {
          setPlayer1Time((prevTime) => prevTime - 1);
        }
        else if (currentPlayer === 2 && player2Time > 0) {
          setPlayer2Time((prevTime) => prevTime - 1);
        }
      }
    }, 1000)
    return () => {
      clearInterval(interval);
    };
  }, [currentPlayer, paused, player1Time, player2Time]);

  // Function to format time in MM:SS format
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds = String(remainingSeconds).padStart(2, '0'); // Ensure two-digit formatting
    return `${minutes}:${formattedSeconds}`;
  }

  // Function to toggle between players and start the clock
  function togglePlayers(id) {
    setPaused(false)
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
  }, [isVisible, theme])

  // Function to reset the game
  function resetGame() {
    setPaused(true);
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
            <Text style={[styles.reverseText, styles.clock, { color: fontColorContrast(theme.colors) }]}>{formatTime(player1Time)}</Text>
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
          {currentPlayer !== 0 ?
            <>
              <Button style={{ marginRight: 10 }} onPress={() => pause()} title="Pause" />
              <Button style={{ marginLeft: 10 }} onPress={() => resetGame()} title="Reset" />
            </>
            :
            <>
              <Button style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Settings')} title="Settings" />
              <Button style={{ marginLeft: 10 }} onPress={() => resetGame()} title="Reset" />
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
            <Text style={[styles.clock, { color: fontColorContrast(theme.colors2) }]}>{formatTime(player2Time)}</Text>
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
  middle: {
    backgroundColor: "#111",
    flex: 0.7,
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
