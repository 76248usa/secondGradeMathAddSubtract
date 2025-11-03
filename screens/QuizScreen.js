// screens/QuizScreen.js
import React, { useRef, useState, useMemo, useEffect } from "react";
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
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import Colors from "../constants/colors";
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

  // Track keyboard state to tweak spacing only (no transforms)
  const [kbOpen, setKbOpen] = useState(false);
  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvt, () => setKbOpen(true));
    const hideSub = Keyboard.addListener(hideEvt, () => setKbOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Pick a question
  const [index] = useState(() => Math.floor(Math.random() * DATA.length));
  const q = DATA[index];

  // UI state
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Animations
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

  // Confetti sizing by device
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={R.insets.top}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={
              Platform.OS === "ios" ? "interactive" : "on-drag"
            }
            contentInsetAdjustmentBehavior="always"
          >
            <View
              style={[styles.container, kbOpen ? styles.containerKbOpen : null]}
            >
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
                  kbOpen && styles.mascotLift, // ← add this
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

              <View style={[styles.card, kbOpen && styles.cardLift]}>
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
          </ScrollView>
        </KeyboardAvoidingView>
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
    scrollContent: { flexGrow: 1 },
    container: {
      flex: 1,
      paddingTop: R.isLandscape ? 8 : 16,
      paddingBottom: 16 + R.insets.bottom,
      paddingHorizontal: R.isTablet ? 48 : R.isLargePhone ? 28 : 20,
      justifyContent: "center",
    },

    containerKbOpen: {
      paddingBottom: 8,
      paddingTop: 4, // ← nudge content towards the top
      justifyContent: "flex-start",
    },

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    streakRow: { flexDirection: "row", gap: 4 },
    star: { fontSize: starFont },

    mascotWrap: { alignItems: "center", marginBottom: R.isLandscape ? 10 : 20 },
    mascotLift: {
      // Move mascot up when keyboard shows
      marginTop: R.isTablet ? -56 : R.isLargePhone ? -42 : -34,
    },
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
    cardLift: {
      // Move card up a bit more than mascot to clear the keyboard comfortably
      marginTop: R.isTablet ? -28 : R.isLargePhone ? -22 : -18,
    },

    question: {
      fontSize: questionFont,
      fontWeight: "600",
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
