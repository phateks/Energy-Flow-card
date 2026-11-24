import { LovelaceCardConfig } from "custom-card-helpers";

export const CARD_VERSION = "0.1.4";

/** A measuring device on the supply side (grid meter, sub-meter...). */
export interface MeterConfig {
  name?: string;
  icon?: string;
  /** Instant power, W or kW. */
  power?: string;
  /** Voltage, V. Drives the corner gauge and the voltage chart. */
  voltage?: string;
  /** Current, A. Optional: otherwise power / voltage. */
  current?: string;
  /** Cumulative energy (total_increasing), Wh/kWh/MWh. Preferred source for "today". */
  energy?: string;
}

/** A measured load. */
export interface ConsumerConfig {
  name?: string;
  icon?: string;
  color?: string;
  power?: string;
  energy?: string;
}

export interface EnergyFlowCardConfig extends LovelaceCardConfig {
  title?: string;
  icon?: string;
  meters?: MeterConfig[];
  consumers?: ConsumerConfig[];
  /**
   * House total, read directly from sensors. Takes priority over the sum of
   * meters / consumers. Use this when you have one sensor for the whole house.
   */
  total_power?: string;
  total_energy?: string;
  /** Show the "unmeasured" node (meters total − consumers). Default true. */
  show_unmeasured?: boolean;
  unmeasured_name?: string;
  /** Narrow layout: max nodes in the flow before grouping into "Rest". Default 6. */
  max_flow_nodes?: number;
  /** Voltage band considered normal (green). Defaults 216–244 V. */
  voltage_min?: number;
  voltage_max?: number;
  /** Voltage chart window, hours. Default 1. */
  voltage_hours?: number;
  /** Full scale of the current bar (wide layout). Default 32 A. */
  current_max?: number;
  /** Below this power (W) a node counts as idle (no flow animation). Default 5. */
  idle_threshold?: number;
  /** Text overrides. */
  labels?: Partial<Labels>;
}

export interface Labels {
  today: string;
  now: string;
  voltage: string;
  current: string;
  peak_today: string;
  rest: string;
  window: string;
}

export const DEFAULT_LABELS: Labels = {
  today: "Today",
  now: "Now",
  voltage: "Voltage",
  current: "Current",
  peak_today: "Peak today",
  rest: "Rest",
  window: "last {h}",
};

export const DEFAULTS = {
  title: "Home Energy",
  icon: "mdi:lightning-bolt",
  unmeasured_name: "Unmeasured",
  max_flow_nodes: 6,
  voltage_min: 216,
  voltage_max: 244,
  /** Gauge scale (EN 50160: 230 V ±10 %). */
  gauge_min: 207,
  gauge_max: 253,
  voltage_hours: 1,
  current_max: 32,
  idle_threshold: 5,
};

/** ebusd-card palette, used in order for consumers without a colour. */
export const PALETTE = [
  "#ff8a5c",
  "#4ecdc4",
  "#b39dff",
  "#ffd166",
  "#8fb3ff",
  "#5dcaa5",
  "#ff7aa2",
  "#c9d6e8",
  "#f4a261",
  "#7bdff2",
];
export const UNMEASURED_COLOR = "#6f84a0";
export const METER_COLOR = "#8fb3ff";
export const VOLTAGE_COLORS = ["#5dcaa5", "#8fb3ff", "#ffd166", "#b39dff"];

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
