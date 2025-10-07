import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { WelcomeOverlay } from "@ui/components/WelcomeOverlay.native";
import { H1, Table, ThemeProvider, ThemeToggle, useTokens } from "@ui";

const AppContent = () => {
  const { color, space } = useTokens();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ padding: space.lg, width: "100%", maxWidth: 760 }}>
          <H1>Poker Native</H1>
          <ThemeToggle />
        </View>
        <View
          style={{
            marginTop: space.lg,
            width: "100%",
            maxWidth: 760,
            alignItems: "center",
          }}
        >
          <Table />
        </View>
      </ScrollView>
      {showWelcome && <WelcomeOverlay onFinish={() => setShowWelcome(false)} />}
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingBottom: 48,
  },
  welcomeText: {
    color: "#f5f5f5",
    fontSize: 24,
    fontWeight: "700",
  },
});
