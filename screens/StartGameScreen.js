// import { useState } from "react";
// import { TextInput, View, StyleSheet, Alert } from "react-native";

// import PrimaryButton from "../components/ui/PrimaryButton";
// import Title from "../components/ui/Title";
// import Colors from "../constants/colors";
// import Card from "../components/ui/Card";
// import InstructionText from "../components/ui/InstructionText";

// function StartGameScreen({ onPickNumber }) {
//   const [enteredNumber, setEnteredNumber] = useState("");

//   function numberInputHandler(enteredText) {
//     setEnteredNumber(enteredText);
//   }

//   function resetInputHandler() {
//     setEnteredNumber("");
//   }

//   function confirmInputHandler() {
//     const chosenNumber = parseInt(enteredNumber);

//     if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
//       Alert.alert(
//         "Invalid number!",
//         "Number has to be a number between 1 and 99.",
//         [{ text: "Okay", style: "destructive", onPress: resetInputHandler }]
//       );
//       return;
//     }

//     onPickNumber(chosenNumber);
//   }

//   return (
//     <View style={styles.rootContainer}>
//       <Title>Guess My Number</Title>
//       <Card>
//         <InstructionText>Enter a Number</InstructionText>
//         <TextInput
//           style={styles.numberInput}
//           maxLength={2}
//           keyboardType="number-pad"
//           autoCapitalize="none"
//           autoCorrect={false}
//           onChangeText={numberInputHandler}
//           value={enteredNumber}
//         />
//         <View style={styles.buttonsContainer}>
//           <View style={styles.buttonContainer}>
//             <PrimaryButton onPress={resetInputHandler}>Reset</PrimaryButton>
//           </View>
//           <View style={styles.buttonContainer}>
//             <PrimaryButton onPress={confirmInputHandler}>Confirm</PrimaryButton>
//           </View>
//         </View>
//       </Card>
//     </View>
//   );
// }

// export default StartGameScreen;

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     marginTop: 100,
//     alignItems: "center",
//   },
//   numberInput: {
//     height: 50,
//     width: 50,
//     fontSize: 32,
//     borderBottomColor: Colors.accent500,
//     borderBottomWidth: 2,
//     color: Colors.accent500,
//     marginVertical: 8,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//   },
//   buttonContainer: {
//     flex: 1,
//   },
// });

function StartGameScreen({ navigation }) {
  const [index] = useState(() => Math.floor(Math.random() * DATA.length)); // pick one question
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const q = DATA[index];

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
      // Correct! Go to GameOver screen.
      navigation.replace("GameOver", {
        id: q.id,
        question: q.question,
        correct: q.answer,
        yourAnswer: userNum,
      });
    } else {
      setFeedback(`❌ Not quite. Try again!`);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: COLORS.pink }]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.qBadge}>Question {q.id}</Text>
          <Text style={styles.question}>{q.question}</Text>

          <TextInput
            value={answer}
            onChangeText={setAnswer}
            keyboardType="number-pad"
            placeholder="Type your answer"
            placeholderTextColor="#94a3b8"
            returnKeyType="done"
            onSubmitEditing={onConfirm}
            style={styles.input}
          />

          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </Pressable>

          {!!feedback && (
            <Text
              style={[
                styles.feedback,
                {
                  color: feedback.startsWith("❌") ? COLORS.rose : COLORS.mint,
                },
              ]}
            >
              {feedback}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
