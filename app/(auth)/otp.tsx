import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function otp() {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        Enter the 4-digit code sent to your email
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            ref={(ref) => {
              if (ref) inputs.current[index] = ref;
            }}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <View style={styles.backContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#22c55e",
  },
  backContainer: {
    width: "100%",
    marginTop: 15,
  },
  backText: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#22c55e",
    textAlign: "center",
    fontSize: 22,
    color: "white",
    backgroundColor: "#1e293b",
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
