// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   StyleSheet,
//   Dimensions,
//   Animated,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import Colors from "../constants/colors";
// import ConfettiCannon from "react-native-confetti-cannon";

// const { width } = Dimensions.get("window");

// const COLORS = {
//   pink: "#FF9A9E",
//   rose: "#cf6064",
//   mint: "#84FAB0",
//   textDark: "#1f2937",
//   white: "#ffffff",
// };

// export default function GameOverScreen({ route, navigation }) {
//   const { question, correct, yourAnswer, id } = route.params || {};

//   // 🏆 pulsing mascot
//   const pulse = useRef(new Animated.Value(0)).current;
//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulse, {
//           toValue: 1,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulse, {
//           toValue: 0,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [pulse]);

//   const mascotScale = pulse.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.3],
//   });

//   return (
//     <SafeAreaView style={[styles.safe, { backgroundColor: COLORS.mint }]}>
//       <LinearGradient
//         style={styles.rootScreen}
//         colors={[Colors.primary700, Colors.accent500]}
//       >
//         <View style={styles.container}>
//           {/* 🎉 Confetti celebration */}
//           <ConfettiCannon
//             count={180}
//             origin={{ x: width / 2, y: -10 }}
//             fadeOut
//             explosionSpeed={300}
//             fallSpeed={7000}
//           />

//           <View style={styles.card}>
//             {/* badge */}
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>You Rock! 🥳</Text>
//             </View>

//             {/* big mascot */}
//             <Animated.View
//               style={[
//                 styles.mascotWrap,
//                 { transform: [{ scale: mascotScale }] },
//               ]}
//             >
//               <Text style={styles.mascot} accessibilityLabel="Trophy emoji">
//                 🏆
//               </Text>
//             </Animated.View>

//             <Text style={[styles.title, { color: COLORS.rose }]}>
//               Great Job!
//             </Text>
//             <Text style={styles.summary}>
//               You solved <Text style={styles.bold}>Question {id}</Text>{" "}
//               correctly! 🎯
//             </Text>

//             {/* fun stickers row */}
//             <View style={styles.stickersRow}>
//               <Text style={styles.sticker}>⭐️</Text>
//               <Text style={styles.sticker}>🍭</Text>
//               <Text style={styles.sticker}>🚀</Text>
//               <Text style={styles.sticker}>🧠</Text>
//             </View>

//             {/* friendly results box */}
//             <View style={styles.resultBox}>
//               <Text style={styles.resultLabel}>Question</Text>
//               <Text style={styles.resultValue}>{question}</Text>

//               <Text style={[styles.resultLabel, { marginTop: 12 }]}>
//                 Your Answer
//               </Text>
//               <Text style={styles.resultValue}>{yourAnswer}</Text>

//               <Text style={[styles.resultLabel, { marginTop: 12 }]}>
//                 Correct Answer
//               </Text>
//               <Text style={styles.resultValue}>{correct}</Text>
//             </View>

//             {/* big friendly CTA */}
//             <Pressable
//               accessibilityRole="button"
//               accessibilityLabel="Play again"
//               onPress={() => navigation.replace("Quiz")}
//               style={({ pressed }) => [
//                 styles.button,
//                 { opacity: pressed ? 0.9 : 1 },
//               ]}
//             >
//               <LinearGradient
//                 colors={[COLORS.rose, COLORS.pink]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.buttonGradient}
//               >
//                 <Text style={styles.buttonText}>Play Again 🚀</Text>
//               </LinearGradient>
//             </Pressable>

//             {/* gentle tip */}
//             <Text style={styles.tip}>
//               Tip: Can you beat your time next round? ⏱️
//             </Text>
//           </View>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1 },
//   rootScreen: { flex: 1 },
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//   },

//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: 24,
//     padding: 22,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 8 },
//     elevation: 5,
//   },

//   badge: {
//     alignSelf: "center",
//     backgroundColor: "#fff5f5",
//     borderColor: COLORS.rose,
//     borderWidth: 2,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 999,
//     marginBottom: 10,
//   },
//   badgeText: { color: COLORS.rose, fontWeight: "900" },

//   mascotWrap: { alignItems: "center", marginBottom: 6 },
//   mascot: {
//     fontSize: 110, // big & friendly
//     textShadowColor: "rgba(0,0,0,0.15)",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: "900",
//     textAlign: "center",
//     marginTop: 6,
//   },
//   summary: {
//     textAlign: "center",
//     color: COLORS.textDark,
//     marginTop: 6,
//     marginBottom: 10,
//     fontSize: 16,
//   },
//   bold: { fontWeight: "900" },

//   stickersRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 10,
//     marginBottom: 10,
//   },
//   sticker: { fontSize: 22 },

//   resultBox: {
//     borderWidth: 3,
//     borderColor: COLORS.pink,
//     borderRadius: 18,
//     padding: 14,
//     marginBottom: 18,
//     backgroundColor: "#fff",
//   },
//   resultLabel: {
//     fontWeight: "900",
//     color: COLORS.rose,
//   },
//   resultValue: {
//     color: COLORS.textDark,
//     marginTop: 4,
//     fontSize: 16,
//   },

//   button: {
//     marginTop: 6,
//     borderRadius: 18,
//     overflow: "hidden",
//   },
//   buttonGradient: {
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontWeight: "900",
//     fontSize: 18,
//   },

//   tip: {
//     marginTop: 10,
//     textAlign: "center",
//     color: "#6b7280",
//     fontSize: 12,
//   },
// });

//

// screens/GameOverScreen.js
import React, { useEffect, useRef, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/colors";
import ConfettiCannon from "react-native-confetti-cannon";
import useResponsive from "../hooks/useResponsive";

const PALETTE = {
  pink: "#FF9A9E",
  rose: "#cf6064",
  mint: "#84FAB0",
  textDark: "#1f2937",
  white: "#ffffff",
};

export default function GameOverScreen({ route, navigation }) {
  const { question, correct, yourAnswer, id } = route?.params || {};
  const R = useResponsive();

  // pulsing mascot
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const mascotScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const styles = useMemo(() => createStyles(R), [R]);

  const confettiCount = R.isTablet
    ? 180
    : R.isLargePhone
    ? 140
    : R.isSmallPhone
    ? 90
    : 120;
  const confettiOrigin = { x: R.width / 2, y: -10 };
  const confettiFallSpeed = R.isTablet ? 7000 : 6500;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        style={styles.rootScreen}
        colors={[Colors.primary700, Colors.accent500]}
      >
        <View style={styles.container}>
          <ConfettiCannon
            count={confettiCount}
            origin={confettiOrigin}
            fadeOut
            explosionSpeed={300}
            fallSpeed={confettiFallSpeed}
          />

          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>You Rock! 🥳</Text>
            </View>

            <Animated.View
              style={[
                styles.mascotWrap,
                { transform: [{ scale: mascotScale }] },
              ]}
            >
              <Text style={styles.mascot} accessibilityLabel="Trophy emoji">
                🏆
              </Text>
            </Animated.View>

            <Text style={styles.title}>Great Job!</Text>
            <Text style={styles.summary}>
              You solved <Text style={styles.bold}>Question {id}</Text>{" "}
              correctly! 🎯
            </Text>

            <View style={styles.stickersRow}>
              <Text style={styles.sticker}>⭐️</Text>
              <Text style={styles.sticker}>🍭</Text>
              <Text style={styles.sticker}>🚀</Text>
              <Text style={styles.sticker}>🧠</Text>
            </View>

            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Question</Text>
              <Text style={styles.resultValue}>{question}</Text>

              <Text style={[styles.resultLabel, { marginTop: 12 }]}>
                Your Answer
              </Text>
              <Text style={styles.resultValue}>{yourAnswer}</Text>

              <Text style={[styles.resultLabel, { marginTop: 12 }]}>
                Correct Answer
              </Text>
              <Text style={styles.resultValue}>{correct}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Play again"
              onPress={() => navigation.replace("Quiz")}
              style={({ pressed }) => [
                styles.button,
                { opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <LinearGradient
                colors={[PALETTE.rose, PALETTE.pink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Play Again 🚀</Text>
              </LinearGradient>
            </Pressable>

            <Text style={styles.tip}>
              Tip: Can you beat your time next round? ⏱️
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function createStyles(R) {
  const mascotSize = R.isTablet
    ? 150
    : R.isLargePhone
    ? 120
    : R.isSmallPhone
    ? 90
    : 110;

  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: PALETTE.mint },
    rootScreen: { flex: 1 },
    container: {
      flex: 1,
      padding: R.isTablet ? 28 : R.isLargePhone ? 24 : 20,
      justifyContent: "center",
    },

    card: {
      backgroundColor: PALETTE.white,
      borderRadius: R.isTablet ? 24 : 20,
      padding: R.isTablet ? 26 : R.isLargePhone ? 24 : 22,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
      maxWidth: R.cardMaxWidth,
      alignSelf: R.cardMaxWidth ? "center" : "stretch",
      width: R.cardMaxWidth ? "90%" : "auto",
    },

    badge: {
      alignSelf: "center",
      backgroundColor: "#fff5f5",
      borderColor: PALETTE.rose,
      borderWidth: 2,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      marginBottom: 10,
    },
    badgeText: {
      color: PALETTE.rose,
      fontWeight: "900",
      fontSize: R.scale(12),
    },

    mascotWrap: { alignItems: "center", marginBottom: 6 },
    mascot: {
      fontSize: mascotSize,
      textShadowColor: "rgba(0,0,0,0.15)",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },

    title: {
      fontSize: R.isTablet ? 30 : R.isLargePhone ? 28 : 26,
      fontWeight: "900",
      textAlign: "center",
      color: PALETTE.rose,
      marginTop: 6,
    },
    summary: {
      textAlign: "center",
      color: PALETTE.textDark,
      marginTop: 6,
      marginBottom: 10,
      fontSize: R.isTablet ? 18 : R.isLargePhone ? 17 : 16,
    },
    bold: { fontWeight: "900" },

    stickersRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginBottom: 10,
    },
    sticker: { fontSize: R.isTablet ? 24 : R.isLargePhone ? 23 : 22 },

    resultBox: {
      borderWidth: R.isTablet ? 4 : 3,
      borderColor: PALETTE.pink,
      borderRadius: 18,
      padding: R.isTablet ? 16 : R.isLargePhone ? 15 : 14,
      marginBottom: 18,
      backgroundColor: "#fff",
    },
    resultLabel: {
      fontWeight: "900",
      color: PALETTE.rose,
      fontSize: R.scale(12),
    },
    resultValue: {
      color: PALETTE.textDark,
      marginTop: 4,
      fontSize: R.isTablet ? 16 : R.isLargePhone ? 16 : 15,
    },

    button: { marginTop: 6, borderRadius: 18, overflow: "hidden" },
    buttonGradient: {
      paddingVertical: R.isTablet ? 16 : R.isLargePhone ? 15 : 14,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: PALETTE.white,
      fontWeight: "900",
      fontSize: R.isTablet ? 20 : R.isLargePhone ? 19 : 18,
    },

    tip: {
      marginTop: 10,
      textAlign: "center",
      color: "#6b7280",
      fontSize: R.isTablet ? 14 : R.isLargePhone ? 13 : 12,
    },
  });
}
