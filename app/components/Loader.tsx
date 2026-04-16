import React from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

interface LoaderProps {
  size?: "small" | "large";
  color?: string;
  showLogo?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = "large",
  color = "#01411C",
  showLogo = true,
}) => {
  return (
    <View style={styles.container}>
      {showLogo && (
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
});
