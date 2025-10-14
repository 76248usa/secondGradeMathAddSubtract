// import { StyleSheet, ImageBackground, Text } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useState } from "react";
// import { useFonts } from "expo-font";
// import StartGameScreen from "./screens/StartGameScreen";
// import GameScreen from "./screens/GameScreen";
// import Colors from "./constants/colors";
// import GameOverScreen from "./screens/GameOverScreen";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function App() {
//   const [userNumber, setUserNumber] = useState();
//   const [gameIsOver, setGameIsOver] = useState(true);
//   const [guessRounds, setGuessRounds] = useState(0);
//   // Load fonts
//   const [fontsLoaded] = useFonts({
//     OpenSans: require("./assets/fonts/OpenSans-Regular.ttf"),
//     OpenSansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
//   });

//   // Watch for fonts to be loaded, then hide the splash screen

//   function pickedNumberHandler(pickedNumber) {
//     setUserNumber(pickedNumber);
//     setGameIsOver(false);
//   }

//   function gameOverHandler() {
//     setGameIsOver(true);
//   }
//   function startNewGameHandler() {
//     setUserNumber(null);
//     setGameIsOver(true);
//     setGuessRounds(guessRounds);
//   }
//   // let screen = <StartGameScreen onNumberConfirm={pickedNumberHandler} />;
//   let screen = <StartGameScreen onPickNumber={pickedNumberHandler} />;

//   if (userNumber) {
//     screen = (
//       <GameScreen userNumber={userNumber} onGameOver={gameOverHandler} />
//     );
//   }

//   if (gameIsOver && userNumber) {
//     screen = (
//       <GameOverScreen
//         userNumber={userNumber}
//         roundsNumber={guessRounds}
//         onStartNewGame={startNewGameHandler}
//       />
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <LinearGradient
//         style={styles.rootScreen}
//         colors={[Colors.primary700, Colors.accent500]}
//       >
//         <ImageBackground
//           source={require("./assets/images/background.png")}
//           resizeMode="cover"
//           style={styles.rootScreen}
//           imageStyle={styles.backgroundImage}
//         >
//           <SafeAreaView style={styles.rootScreen}>{screen}</SafeAreaView>
//         </ImageBackground>
//       </LinearGradient>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   rootScreen: {
//     flex: 1,
//   },
//   backgroundImage: {
//     opacity: 0.15,
//   },
// });

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuizScreen from "./screens/QuizScreen";
import GameOverScreen from "./screens/GameOverScreen";

const Stack = createNativeStackNavigator();

const COLORS = {
  pink: "#FF9A9E",
  rose: "#cf6064",
  mint: "#84FAB0",
  white: "#ffffff",
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Quiz"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.pink },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: "Math Quiz" }}
        />
        <Stack.Screen
          name="GameOver"
          component={GameOverScreen}
          options={{ title: "Game Over" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
