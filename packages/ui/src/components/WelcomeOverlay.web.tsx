import React from "react";
import { useState } from "react";

export type WelcomeOverlayProps = {
  onFinish: () => void;
};

export const WelcomeOverlay = ({ onFinish }: WelcomeOverlayProps) => {
  const [cycle, setCycle] = useState(0);

  return (
    <div
      key={cycle}
      className="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Poker welcome"
    >
      <span className="welcome-text anim-typewriter">
        <span>Welcome to the</span>
        <span className="welcome-word">
          <span className="poker-word">Poker</span>
        </span>
        <span className="after-word">Game.</span>
      </span>
      <button className="welcome-button welcome-play" onClick={onFinish} type="button">
        <span className="label-base">Play</span>
        <span className="label-extra">Poker</span>
      </button>
      <button
        className="welcome-button outline welcome-replay"
        onClick={() => setCycle((prev) => prev + 1)}
        type="button"
      >
        <span>↻</span> Replay Animation
      </button>
    </div>
  );
};
