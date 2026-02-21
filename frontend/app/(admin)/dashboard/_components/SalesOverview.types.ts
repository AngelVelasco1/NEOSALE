export type ChangeDirection = "increase" | "decrease" | "neutral";

export type IconToken =
  | "revenue"
  | "orders"
  | "products"
  | "customers"
  | "trend"
  | "conversion"
  | "pending"
  | "activeUsers";

export interface MetricCardDescriptor {
  icon: IconToken;
  title: string;
  value: string;
  change: string;
  changeType: ChangeDirection;
  subtitle: string;
  gradient: string;
  border: string;
  glow: string;
  iconBg: string;
  progressValue: number;
  progressLabel?: string;
  badgeLabel?: string;
  goalLabel?: string;
  goalFormatted?: string;
}

export interface QuickStatDescriptor {
  icon: IconToken;
  title: string;
  helper: string;
  value: string;
  background: string;
  border: string;
  accent: string;
}

export interface SalesHeroDescriptor {
  title: string;
  description: string;
  timeframe: string;
  mainValue: string;
  change: string;
  changeType: ChangeDirection;
  secondaryLabel: string;
  secondaryValue: string;
  tertiaryLabel: string;
  tertiaryValue: string;
}

export interface SalesOverviewPayload {
  hero?: SalesHeroDescriptor;
  metrics: MetricCardDescriptor[];
  quickStats: QuickStatDescriptor[];
}
