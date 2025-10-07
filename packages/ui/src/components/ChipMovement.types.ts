export type ChipTarget = {
  id: string;
  offset: { x: number; y: number };
  chipCount: number;
};

export type ChipMovementProps = {
  targets: ChipTarget[];
  trigger: number;
  duration?: number;
  delayBetween?: number;
};
