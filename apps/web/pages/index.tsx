import { useState } from "react";
import Head from "next/head";

import { H1, Table, ThemeProvider, ThemeToggle, useTokens } from "@ui";
import { WelcomeOverlay } from "@ui/components/WelcomeOverlay.web";

const PageContent = () => {
  const { color, space } = useTokens();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: color.background,
        color: color.textPrimary,
        padding: space.lg,
        gap: space.lg,
      }}
    >
      <div style={{ width: "100%", maxWidth: 760 }}>
        <H1>Poker Web + RN Web</H1>
        <ThemeToggle />
      </div>
      <div style={{ width: "100%", maxWidth: 760 }}>
        <Table />
      </div>
      {showWelcome && <WelcomeOverlay onFinish={() => setShowWelcome(false)} />}
    </main>
  );
};

export default function Page() {
  return (
    <ThemeProvider>
      <Head>
        <title>Poker Web</title>
      </Head>
      <PageContent />
    </ThemeProvider>
  );
}
