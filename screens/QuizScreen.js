// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   Keyboard,
//   Alert,
//   Animated,
//   Easing,
//   Vibration,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import ConfettiCannon from "react-native-confetti-cannon";
// import Colors from "../constants/colors";
// import { DATA } from "../data/MathQuestions";

// const PALETTE = {
//   pink: "#FF9A9E",
//   rose: "#cf6064",
//   mint: "#84FAB0",
//   textDark: "#1f2937",
//   white: "#ffffff",
//   slate: "#94a3b8",
// };

// export default function QuizScreen({ navigation }) {
//   // pick one question
//   const [index] = useState(() => Math.floor(Math.random() * DATA.length));
//   const q = DATA[index];
//   const [answer, setAnswer] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [streak, setStreak] = useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [wrongCount, setWrongCount] = useState(0);
//   const [showHint, setShowHint] = useState(false);

//   // animations
//   const shake = useRef(new Animated.Value(0)).current;
//   const bounce = useRef(new Animated.Value(0)).current;

//   function doShake() {
//     shake.setValue(0);
//     Animated.sequence([
//       Animated.timing(shake, {
//         toValue: 1,
//         duration: 60,
//         useNativeDriver: true,
//         easing: Easing.linear,
//       }),
//       Animated.timing(shake, {
//         toValue: -1,
//         duration: 60,
//         useNativeDriver: true,
//         easing: Easing.linear,
//       }),
//       Animated.timing(shake, {
//         toValue: 1,
//         duration: 60,
//         useNativeDriver: true,
//         easing: Easing.linear,
//       }),
//       Animated.timing(shake, {
//         toValue: 0,
//         duration: 60,
//         useNativeDriver: true,
//         easing: Easing.linear,
//       }),
//     ]).start();
//   }

//   function doBounce() {
//     bounce.setValue(0);
//     Animated.spring(bounce, {
//       toValue: 1,
//       friction: 3,
//       tension: 120,
//       useNativeDriver: true,
//     }).start(() => bounce.setValue(0));
//   }

//   const mascotShake = shake.interpolate({
//     inputRange: [-1, 0, 1],
//     outputRange: [-10, 0, 10],
//   });

//   const mascotScale = bounce.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.2],
//   });

//   function onConfirm() {
//     Keyboard.dismiss();

//     if (!answer.trim()) {
//       Alert.alert("Try a number", "Please type an answer.");
//       return;
//     }

//     const userNum = Number(answer.trim());
//     if (!Number.isFinite(userNum)) {
//       setFeedback("Please enter numbers only.");
//       return;
//     }

//     if (userNum === q.answer) {
//       setFeedback("✅ Woohoo! You got it!");
//       setStreak((s) => s + 1);
//       setShowConfetti(true);
//       doBounce();

//       // tiny delay for celebration, then move on
//       setTimeout(() => {
//         navigation.replace("GameOver", {
//           id: q.id,
//           question: q.question,
//           correct: q.answer,
//           yourAnswer: userNum,
//         });
//       }, 900);
//     } else {
//       setFeedback("❌ Not quite. Try again!");
//       setWrongCount((w) => w + 1);
//       setStreak(0);
//       setShowConfetti(false);
//       doShake();
//       Vibration.vibrate(40);
//     }
//   }

//   function handleHint() {
//     setShowHint((v) => !v);
//   }

//   const hintText = (() => {
//     if (!showHint) return "";
//     const parity = q.answer % 2 === 0 ? "even" : "odd";
//     let moreLess = "";
//     if (wrongCount > 0) {
//       if (Number(answer) > 0 && Number.isFinite(Number(answer))) {
//         if (Number(answer) > q.answer) moreLess = "Try a smaller number.";
//         else if (Number(answer) < q.answer) moreLess = "Try a bigger number.";
//       }
//     }
//     return `Hint: The answer is ${parity}. ${moreLess}`.trim();
//   })();

//   return (
//     // <SafeAreaView style={[styles.safe, { backgroundColor: PALETTE.pink }]}>
//     <LinearGradient
//       style={styles.rootScreen}
//       colors={[Colors.primary700, Colors.accent500]}
//     >
//       <View style={styles.container}>
//         {/* Confetti when correct */}
//         {showConfetti && (
//           <ConfettiCannon
//             count={120}
//             origin={{ x: 0, y: 0 }}
//             fadeOut
//             explosionSpeed={300}
//             fallSpeed={6500}
//           />
//         )}

//         {/* Header: progress + streak */}
//         <View style={styles.headerRow}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>Q#{q.id}</Text>
//           </View>
//           <View style={styles.streakRow}>
//             {Array.from({ length: Math.min(streak, 3) }).map((_, i) => (
//               <Text key={i} style={styles.star}>
//                 ⭐
//               </Text>
//             ))}
//           </View>
//         </View>

//         {/* Mascot */}
//         <Animated.View
//           style={[
//             styles.mascotWrap,
//             {
//               transform: [{ translateX: mascotShake }, { scale: mascotScale }],
//             },
//           ]}
//         >
//           <Text style={styles.mascot} aria-label="mascot">
//             {feedback.startsWith("✅") ? "🤩" : "🤓"}
//           </Text>
//         </Animated.View>

//         {/* Card */}
//         <View style={styles.card}>
//           <Text style={styles.question}>{q.question}</Text>

//           <TextInput
//             value={answer}
//             onChangeText={setAnswer}
//             keyboardType="number-pad"
//             placeholder="Type your answer"
//             placeholderTextColor={PALETTE.slate}
//             returnKeyType="done"
//             onSubmitEditing={onConfirm}
//             style={styles.input}
//           />

//           <View style={styles.ctaRow}>
//             <Pressable
//               onPress={onConfirm}
//               style={({ pressed }) => [
//                 styles.buttonPrimary,
//                 { opacity: pressed ? 0.9 : 1 },
//               ]}
//             >
//               <Text style={styles.buttonText}>✅ Check</Text>
//             </Pressable>

//             <Pressable
//               onPress={handleHint}
//               style={({ pressed }) => [
//                 styles.buttonGhost,
//                 { opacity: pressed ? 0.8 : 1 },
//               ]}
//             >
//               <Text style={styles.buttonGhostText}>
//                 {showHint ? "🙈 Hide Hint" : "💡 Show Hint"}
//               </Text>
//             </Pressable>
//           </View>

//           {!!feedback && (
//             <Text
//               style={[
//                 styles.feedback,
//                 {
//                   color: feedback.startsWith("❌")
//                     ? PALETTE.rose
//                     : PALETTE.mint,
//                 },
//               ]}
//             >
//               {feedback}
//             </Text>
//           )}

//           {!!hintText && <Text style={styles.hint}>{hintText}</Text>}
//         </View>
//       </View>
//     </LinearGradient>
//     // </SafeAreaView>
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

//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   badge: {
//     backgroundColor: PALETTE.mint,
//     borderRadius: 999,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   badgeText: {
//     color: PALETTE.textDark,
//     fontWeight: "800",
//   },
//   streakRow: { flexDirection: "row", gap: 4 },
//   star: { fontSize: 18 },

//   // mascotWrap: { alignItems: "center", marginBottom: 10 },
//   // mascot: { fontSize: 60 },

//   mascotWrap: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   mascot: {
//     fontSize: 130, // 🧸 much bigger for kids
//     textShadowColor: "rgba(0,0,0,0.2)",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },

//   card: {
//     backgroundColor: PALETTE.white,
//     borderRadius: 22,
//     padding: 22,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 6 },
//     elevation: 4,
//   },
//   question: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: PALETTE.textDark,
//     marginBottom: 14,
//   },
//   input: {
//     borderWidth: 3,
//     borderColor: PALETTE.pink,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 22,
//     color: PALETTE.textDark,
//     textAlign: "center",
//   },

//   ctaRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 14,
//   },
//   buttonPrimary: {
//     flex: 1,
//     backgroundColor: PALETTE.mint,
//     borderRadius: 16,
//     paddingVertical: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: { color: PALETTE.white, fontWeight: "900", fontSize: 18 },

//   buttonGhost: {
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderWidth: 2,
//     borderColor: PALETTE.rose,
//     borderRadius: 16,
//     backgroundColor: "#fff5f5",
//   },
//   buttonGhostText: { color: PALETTE.rose, fontWeight: "800" },

//   feedback: {
//     marginTop: 12,
//     fontSize: 16,
//     fontWeight: "800",
//   },
//   hint: {
//     marginTop: 8,
//     fontSize: 14,
//     color: "#64748b",
//   },
// });

// screens/QuizScreen.tsx (or .js)
// import React, { useRef, useState, useMemo } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   Keyboard,
//   Alert,
//   Animated,
//   Easing,
//   Vibration,
//   useWindowDimensions,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import ConfettiCannon from "react-native-confetti-cannon";
// import Colors from "../constants/colors";
// import { DATA } from "../data/MathQuestions";

// const PALETTE = {
//   pink: "#FF9A9E",
//   rose: "#cf6064",
//   mint: "#84FAB0",
//   textDark: "#1f2937",
//   white: "#ffffff",
//   slate: "#94a3b8",
// };

// /** Responsive helpers (no extra libs) */
// function useResponsive() {
//   const { width, height } = useWindowDimensions();
//   const insets = useSafeAreaInsets();

//   const shortest = Math.min(width, height);
//   const longest = Math.max(width, height);
//   const isLandscape = width > height;
//   const isSmallPhone = shortest < 360;
//   const isTablet = longest >= 900 || shortest >= 600; // iPad/large tablet

//   // size scaler that’s gentle across devices
//   const scale = (size: number) => {
//     const base = 390; // iPhone 12 width baseline
//     const ratio = width / base;
//     const factor = isTablet ? 1.25 : isSmallPhone ? 0.9 : 1.0;
//     return Math.round(size * factor * Math.sqrt(ratio));
//   };

//   return {
//     width,
//     height,
//     insets,
//     isLandscape,
//     isSmallPhone,
//     isTablet,
//     scale,
//   };
// }

// export default function QuizScreen({ navigation }) {
//   const R = useResponsive();

//   // pick one question (stable for this mount)
//   const [index] = useState(() => Math.floor(Math.random() * DATA.length));
//   const q = DATA[index];

//   const [answer, setAnswer] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [streak, setStreak] = useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [wrongCount, setWrongCount] = useState(0);
//   const [showHint, setShowHint] = useState(false);

//   // animations
//   const shake = useRef(new Animated.Value(0)).current;
//   const bounce = useRef(new Animated.Value(0)).current;

//   function doShake() {
//     shake.setValue(0);
//     Animated.sequence([
//       Animated.timing(shake, {
//         toValue: 1,
//         duration: 60,
//         useNativeDriver: true,
//         easing: Easing.linear,
//       }),
//       Animated.timing(shake, {
//         toValue: -1,
//         duration: 60,
//         useNativeDriver: true,
//         easing: Easing.linear,
//       }),
//       Animated.timing(shake, {
//         toValue: 1,
//         duration: 60,
//         useNativeDriver: true,
//         easing: Easing.linear,
//       }),
//       Animated.timing(shake, {
//         toValue: 0,
//         duration: 60,
//         useNativeDriver: true,
//         easing: Easing.linear,
//       }),
//     ]).start();
//   }

//   function doBounce() {
//     bounce.setValue(0);
//     Animated.spring(bounce, {
//       toValue: 1,
//       friction: 3,
//       tension: 120,
//       useNativeDriver: true,
//     }).start(() => bounce.setValue(0));
//   }

//   const mascotShake = shake.interpolate({
//     inputRange: [-1, 0, 1],
//     outputRange: [-10, 0, 10],
//   });
//   const mascotScale = bounce.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.2],
//   });

//   function onConfirm() {
//     Keyboard.dismiss();

//     if (!answer.trim()) {
//       Alert.alert("Try a number", "Please type an answer.");
//       return;
//     }

//     const userNum = Number(answer.trim());
//     if (!Number.isFinite(userNum)) {
//       setFeedback("Please enter numbers only.");
//       return;
//     }

//     if (userNum === q.answer) {
//       setFeedback("✅ Woohoo! You got it!");
//       setStreak((s) => s + 1);
//       setShowConfetti(true);
//       doBounce();

//       setTimeout(() => {
//         navigation.replace("GameOver", {
//           id: q.id,
//           question: q.question,
//           correct: q.answer,
//           yourAnswer: userNum,
//         });
//       }, 900);
//     } else {
//       setFeedback("❌ Not quite. Try again!");
//       setWrongCount((w) => w + 1);
//       setStreak(0);
//       setShowConfetti(false);
//       doShake();
//       // tiny haptic; safe on both platforms (no permission)
//       if (Platform.OS !== "web") Vibration.vibrate(40);
//     }
//   }

//   function handleHint() {
//     setShowHint((v) => !v);
//   }

//   const hintText = useMemo(() => {
//     if (!showHint) return "";
//     const parity = q.answer % 2 === 0 ? "even" : "odd";
//     let moreLess = "";
//     if (wrongCount > 0) {
//       const n = Number(answer);
//       if (Number.isFinite(n)) {
//         if (n > q.answer) moreLess = "Try a smaller number.";
//         else if (n < q.answer) moreLess = "Try a bigger number.";
//       }
//     }
//     return `Hint: The answer is ${parity}. ${moreLess}`.trim();
//   }, [showHint, wrongCount, answer, q.answer]);

//   const styles = useMemo(() => createStyles(R), [R]);

//   const confettiCount = R.isTablet ? 180 : R.isSmallPhone ? 90 : 120;
//   const confettiOrigin = { x: R.width / 2, y: R.isLandscape ? 0 : 0 };
//   const confettiFallSpeed = R.isTablet ? 7000 : 6500;

//   return (
//     <LinearGradient
//       style={styles.rootScreen}
//       colors={[Colors.primary700, Colors.accent500]}
//     >
//       <SafeAreaView style={styles.safe} edges={["top", "right", "left"]}>
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//           keyboardVerticalOffset={R.insets.top + 60}
//         >
//           <View style={styles.container}>
//             {/* Confetti when correct (counts & speed tuned per device) */}
//             {showConfetti && (
//               <ConfettiCannon
//                 count={confettiCount}
//                 origin={confettiOrigin}
//                 fadeOut
//                 explosionSpeed={300}
//                 fallSpeed={confettiFallSpeed}
//               />
//             )}

//             {/* Header: progress + streak */}
//             <View style={styles.headerRow}>
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>Q#{q.id}</Text>
//               </View>
//               <View style={styles.streakRow}>
//                 {Array.from({ length: Math.min(streak, 3) }).map((_, i) => (
//                   <Text key={i} style={styles.star}>
//                     ⭐
//                   </Text>
//                 ))}
//               </View>
//             </View>

//             {/* Mascot */}
//             <Animated.View
//               style={[
//                 styles.mascotWrap,
//                 {
//                   transform: [
//                     { translateX: mascotShake },
//                     { scale: mascotScale },
//                   ],
//                 },
//               ]}
//             >
//               <Text style={styles.mascot} aria-label="mascot">
//                 {feedback.startsWith("✅") ? "🤩" : "🤓"}
//               </Text>
//             </Animated.View>

//             {/* Card (centered and sized for phones/tablets) */}
//             <View style={styles.card}>
//               <Text style={styles.question}>{q.question}</Text>

//               <TextInput
//                 value={answer}
//                 onChangeText={setAnswer}
//                 keyboardType={Platform.select({
//                   ios: "number-pad",
//                   android: "number-pad",
//                   default: "numeric",
//                 })}
//                 placeholder="Type your answer"
//                 placeholderTextColor={PALETTE.slate}
//                 returnKeyType="done"
//                 onSubmitEditing={onConfirm}
//                 style={styles.input}
//                 // Keep text scalable for accessibility but prevent absurd blow-ups
//                 maxFontSizeMultiplier={1.4}
//               />

//               <View style={styles.ctaRow}>
//                 <Pressable
//                   onPress={onConfirm}
//                   hitSlop={10}
//                   style={({ pressed }) => [
//                     styles.buttonPrimary,
//                     { opacity: pressed ? 0.9 : 1 },
//                   ]}
//                 >
//                   <Text style={styles.buttonText}>✅ Check</Text>
//                 </Pressable>

//                 <Pressable
//                   onPress={handleHint}
//                   hitSlop={10}
//                   style={({ pressed }) => [
//                     styles.buttonGhost,
//                     { opacity: pressed ? 0.8 : 1 },
//                   ]}
//                 >
//                   <Text style={styles.buttonGhostText}>
//                     {showHint ? "🙈 Hide Hint" : "💡 Show Hint"}
//                   </Text>
//                 </Pressable>
//               </View>

//               {!!feedback && (
//                 <Text
//                   style={[
//                     styles.feedback,
//                     {
//                       color: feedback.startsWith("❌")
//                         ? PALETTE.rose
//                         : PALETTE.mint,
//                     },
//                   ]}
//                 >
//                   {feedback}
//                 </Text>
//               )}

//               {!!hintText && <Text style={styles.hint}>{hintText}</Text>}
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

/** Dynamic styles driven by device/orientation */
// function createStyles(R: ReturnType<typeof useResponsive>) {
//   const mascotSize = R.isTablet ? 180 : R.isSmallPhone ? 100 : 130;
//   const cardPadding = R.isTablet ? 28 : 22;
//   const cardRadius = R.isTablet ? 28 : 22;
//   const inputFont = R.isTablet ? 26 : R.isSmallPhone ? 20 : 22;
//   const questionFont = R.isTablet ? 24 : 20;
//   const starFont = R.isTablet ? 22 : 18;

//   return StyleSheet.create({
//     safe: { flex: 1 },
//     rootScreen: { flex: 1 },
//     container: {
//       flex: 1,
//       paddingTop: R.isLandscape ? 8 : 16,
//       paddingBottom: 16 + R.insets.bottom,
//       paddingHorizontal: R.isTablet ? 48 : 20,
//       justifyContent: "center",
//     },

//     headerRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 12,
//     },
//     badge: {
//       backgroundColor: PALETTE.mint,
//       borderRadius: 999,
//       paddingHorizontal: 12,
//       paddingVertical: 6,
//       alignSelf: "flex-start",
//     },
//     badgeText: {
//       color: PALETTE.textDark,
//       fontWeight: "800",
//       fontSize: R.scale(12),
//     },
//     streakRow: { flexDirection: "row", gap: 4 },
//     star: { fontSize: starFont },

//     mascotWrap: { alignItems: "center", marginBottom: R.isLandscape ? 10 : 20 },
//     mascot: {
//       fontSize: mascotSize,
//       textShadowColor: "rgba(0,0,0,0.2)",
//       textShadowOffset: { width: 2, height: 2 },
//       textShadowRadius: 4,
//     },

//     card: {
//       backgroundColor: PALETTE.white,
//       borderRadius: cardRadius,
//       padding: cardPadding,
//       shadowColor: "#000",
//       shadowOpacity: 0.08,
//       shadowRadius: 10,
//       shadowOffset: { width: 0, height: 6 },
//       elevation: 4,
//       // tablet-friendly width and centering
//       maxWidth: R.isTablet ? 720 : undefined,
//       alignSelf: R.isTablet ? "center" : "stretch",
//       width: R.isTablet ? "90%" : "auto",
//     },
//     question: {
//       fontSize: questionFont,
//       fontWeight: "800",
//       color: PALETTE.textDark,
//       marginBottom: 14,
//     },
//     input: {
//       borderWidth: R.isTablet ? 4 : 3,
//       borderColor: PALETTE.pink,
//       backgroundColor: "#fff",
//       borderRadius: 16,
//       paddingHorizontal: 16,
//       paddingVertical: R.isTablet ? 14 : 12,
//       fontSize: inputFont,
//       color: PALETTE.textDark,
//       textAlign: "center",
//     },

//     ctaRow: { flexDirection: "row", gap: 10, marginTop: 14 },
//     buttonPrimary: {
//       flex: 1,
//       backgroundColor: PALETTE.mint,
//       borderRadius: 16,
//       paddingVertical: R.isTablet ? 16 : 12,
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     buttonText: {
//       color: PALETTE.white,
//       fontWeight: "900",
//       fontSize: R.isTablet ? 20 : 18,
//     },

//     buttonGhost: {
//       paddingHorizontal: 14,
//       paddingVertical: R.isTablet ? 14 : 12,
//       borderWidth: 2,
//       borderColor: PALETTE.rose,
//       borderRadius: 16,
//       backgroundColor: "#fff5f5",
//     },
//     buttonGhostText: {
//       color: PALETTE.rose,
//       fontWeight: "800",
//       fontSize: R.isTablet ? 16 : 14,
//     },

//     feedback: {
//       marginTop: 12,
//       fontSize: R.isTablet ? 18 : 16,
//       fontWeight: "800",
//     },
//     hint: { marginTop: 8, fontSize: R.isTablet ? 16 : 14, color: "#64748b" },
//   });
// }

//

// screens/QuizScreen.js
import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  Alert,
  Animated,
  Easing,
  Vibration,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import Colors from "../constants/colors"; // if using aliases; otherwise '../constants/colors'
import { DATA } from "../data/MathQuestions";
import useResponsive from "../hooks/useResponsive";

const PALETTE = {
  pink: "#FF9A9E",
  rose: "#cf6064",
  mint: "#84FAB0",
  textDark: "#1f2937",
  white: "#ffffff",
  slate: "#94a3b8",
};

export default function QuizScreen({ navigation }) {
  const R = useResponsive();

  const [index] = useState(() => Math.floor(Math.random() * DATA.length));
  const q = DATA[index];

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // animations
  const shake = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  function doShake() {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(shake, {
        toValue: -1,
        duration: 60,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(shake, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  }

  function doBounce() {
    bounce.setValue(0);
    Animated.spring(bounce, {
      toValue: 1,
      friction: 3,
      tension: 120,
      useNativeDriver: true,
    }).start(() => bounce.setValue(0));
  }

  const mascotShake = shake.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-10, 0, 10],
  });
  const mascotScale = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  function onConfirm() {
    Keyboard.dismiss();
    if (!answer.trim()) {
      Alert.alert("Try a number", "Please type an answer.");
      return;
    }
    const userNum = Number(answer.trim());
    if (!Number.isFinite(userNum)) {
      setFeedback("Please enter numbers only.");
      return;
    }
    if (userNum === q.answer) {
      setFeedback("✅ Woohoo! You got it!");
      setStreak((s) => s + 1);
      setShowConfetti(true);
      doBounce();
      setTimeout(() => {
        navigation.replace("GameOver", {
          id: q.id,
          question: q.question,
          correct: q.answer,
          yourAnswer: userNum,
        });
      }, 900);
    } else {
      setFeedback("❌ Not quite. Try again!");
      setWrongCount((w) => w + 1);
      setStreak(0);
      setShowConfetti(false);
      doShake();
      if (Platform.OS !== "web") Vibration.vibrate(40);
    }
  }

  const handleHint = () => setShowHint((v) => !v);

  const hintText = useMemo(() => {
    if (!showHint) return "";
    const parity = q.answer % 2 === 0 ? "even" : "odd";
    let moreLess = "";
    if (wrongCount > 0) {
      const n = Number(answer);
      if (Number.isFinite(n)) {
        if (n > q.answer) moreLess = "Try a smaller number.";
        else if (n < q.answer) moreLess = "Try a bigger number.";
      }
    }
    return `Hint: The answer is ${parity}. ${moreLess}`.trim();
  }, [showHint, wrongCount, answer, q.answer]);

  const styles = useMemo(() => createStyles(R), [R]);

  const confettiCount = R.isTablet
    ? 180
    : R.isLargePhone
    ? 140
    : R.isSmallPhone
    ? 90
    : 120;
  const confettiOrigin = { x: R.width / 2, y: 0 };
  const confettiFallSpeed = R.isTablet ? 7000 : 6500;

  return (
    <LinearGradient
      style={styles.rootScreen}
      colors={[Colors.primary700, Colors.accent500]}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {showConfetti && (
            <ConfettiCannon
              count={confettiCount}
              origin={confettiOrigin}
              fadeOut
              explosionSpeed={300}
              fallSpeed={confettiFallSpeed}
            />
          )}

          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Q#{q.id}</Text>
            </View>
            <View style={styles.streakRow}>
              {Array.from({ length: Math.min(streak, 3) }).map((_, i) => (
                <Text key={i} style={styles.star}>
                  ⭐
                </Text>
              ))}
            </View>
          </View>

          <Animated.View
            style={[
              styles.mascotWrap,
              {
                transform: [
                  { translateX: mascotShake },
                  { scale: mascotScale },
                ],
              },
            ]}
          >
            <Text style={styles.mascot} aria-label="mascot">
              {feedback.startsWith("✅") ? "🤩" : "🤓"}
            </Text>
          </Animated.View>

          <View style={styles.card}>
            <Text style={styles.question}>{q.question}</Text>

            <TextInput
              value={answer}
              onChangeText={setAnswer}
              keyboardType={Platform.select({
                ios: "number-pad",
                android: "number-pad",
                default: "numeric",
              })}
              placeholder="Type your answer"
              placeholderTextColor={PALETTE.slate}
              returnKeyType="done"
              onSubmitEditing={onConfirm}
              style={styles.input}
              maxFontSizeMultiplier={1.4}
            />

            <View style={styles.ctaRow}>
              <Pressable
                onPress={onConfirm}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.buttonPrimary,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Text style={styles.buttonText}>✅ Check</Text>
              </Pressable>

              <Pressable
                onPress={handleHint}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.buttonGhost,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.buttonGhostText}>
                  {showHint ? "🙈 Hide Hint" : "💡 Show Hint"}
                </Text>
              </Pressable>
            </View>

            {!!feedback && (
              <Text
                style={[
                  styles.feedback,
                  {
                    color: feedback.startsWith("❌")
                      ? PALETTE.rose
                      : PALETTE.mint,
                  },
                ]}
              >
                {feedback}
              </Text>
            )}

            {!!hintText && <Text style={styles.hint}>{hintText}</Text>}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function createStyles(R) {
  const mascotSize = R.isTablet
    ? 176
    : R.isLargePhone
    ? 140
    : R.isSmallPhone
    ? 100
    : 130;
  const cardPadding = R.isTablet ? 28 : R.isLargePhone ? 24 : 22;
  const cardRadius = R.isTablet ? 28 : 22;
  const inputFont = R.isTablet
    ? 26
    : R.isLargePhone
    ? 24
    : R.isSmallPhone
    ? 20
    : 22;
  const questionFont = R.isTablet ? 24 : R.isLargePhone ? 22 : 20;
  const starFont = R.isTablet ? 22 : R.isLargePhone ? 20 : 18;

  return StyleSheet.create({
    safe: { flex: 1 },
    rootScreen: { flex: 1 },
    container: {
      flex: 1,
      paddingTop: R.isLandscape ? 8 : 16,
      paddingBottom: 16 + R.insets.bottom,
      paddingHorizontal: R.isTablet ? 48 : R.isLargePhone ? 28 : 20,
      justifyContent: "center",
    },

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    badge: {
      backgroundColor: PALETTE.mint,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignSelf: "flex-start",
    },
    badgeText: {
      color: PALETTE.textDark,
      fontWeight: "800",
      fontSize: R.scale(12),
    },
    streakRow: { flexDirection: "row", gap: 4 },
    star: { fontSize: starFont },

    mascotWrap: { alignItems: "center", marginBottom: R.isLandscape ? 10 : 20 },
    mascot: {
      fontSize: mascotSize,
      textShadowColor: "rgba(0,0,0,0.2)",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },

    card: {
      backgroundColor: PALETTE.white,
      borderRadius: cardRadius,
      padding: cardPadding,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
      maxWidth: R.cardMaxWidth,
      alignSelf: R.cardMaxWidth ? "center" : "stretch",
      width: R.cardMaxWidth ? "90%" : "auto",
    },
    question: {
      fontSize: questionFont,
      fontWeight: "800",
      color: PALETTE.textDark,
      marginBottom: 14,
    },
    input: {
      borderWidth: R.isTablet ? 4 : 3,
      borderColor: PALETTE.pink,
      backgroundColor: "#fff",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: R.isTablet ? 14 : 12,
      fontSize: inputFont,
      color: PALETTE.textDark,
      textAlign: "center",
    },

    ctaRow: { flexDirection: "row", gap: 10, marginTop: 14 },
    buttonPrimary: {
      flex: 1,
      backgroundColor: PALETTE.mint,
      borderRadius: 16,
      paddingVertical: R.isTablet ? 16 : 12,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: PALETTE.white,
      fontWeight: "900",
      fontSize: R.isTablet ? 20 : R.isLargePhone ? 19 : 18,
    },
    buttonGhost: {
      paddingHorizontal: 14,
      paddingVertical: R.isTablet ? 14 : 12,
      borderWidth: 2,
      borderColor: PALETTE.rose,
      borderRadius: 16,
      backgroundColor: "#fff5f5",
    },
    buttonGhostText: {
      color: PALETTE.rose,
      fontWeight: "800",
      fontSize: R.isTablet ? 16 : R.isLargePhone ? 15 : 14,
    },

    feedback: {
      marginTop: 12,
      fontSize: R.isTablet ? 18 : R.isLargePhone ? 17 : 16,
      fontWeight: "800",
    },
    hint: {
      marginTop: 8,
      fontSize: R.isTablet ? 16 : R.isLargePhone ? 15 : 14,
      color: "#64748b",
    },
  });
}
