import { HomeAssistant } from "custom-card-helpers";

/**
 * Daily energy + history helpers. Everything is computed by the card from the
 * recorder; no utility_meter / integration helpers are needed.
 *
 * Two sources per entity:
 *  - counter: a cumulative energy sensor (total / total_increasing).
 *      today = Σ 5-minute statistic "change" since midnight
 *            + (current state − state at the end of the last compiled bucket)
 *    Falls back to the raw state history if the sensor has no statistics.
 *  - power:   an instant power sensor, integrated over time.
 *      today = Σ 5-minute statistic "mean" × bucket length
 *            + Riemann sum of raw history after the last compiled bucket
 *            + live integration of state updates until the next refresh.
 */

const NO_VALUE = new Set(["unavailable", "unknown", ""]);

export type EnergyBase =
  | { kind: "counter"; base: number; ref: number | undefined }
  | { kind: "power"; base: number; t: number; p: number | undefined };

interface StatRow {
  start: number | string;
  end: number | string;
  change?: number | null;
  state?: number | null;
  mean?: number | null;
  max?: number | null;
}

interface HistRow {
  s: string;
  lu?: number;
  lc?: number;
}

const ms = (t: number | string): number => (typeof t === "number" ? t : Date.parse(t));

/* ---------------- units ---------------- */

export function powerW(hass: HomeAssistant, id?: string): number | undefined {
  const st = id ? hass.states[id] : undefined;
  if (!st || NO_VALUE.has(st.state)) return undefined;
  const v = parseFloat(st.state);
  if (!Number.isFinite(v)) return undefined;
  return v * powerFactor(st.attributes.unit_of_measurement as string | undefined);
}

export function powerFactor(unit?: string): number {
  switch ((unit ?? "W").trim()) {
    case "kW":
      return 1000;
    case "MW":
      return 1e6;
    case "mW":
      return 1e-3;
    default:
      return 1;
  }
}

export function energyFactorKWh(unit?: string): number {
  switch ((unit ?? "kWh").trim()) {
    case "Wh":
      return 1e-3;
    case "MWh":
      return 1000;
    case "GWh":
      return 1e6;
    default:
      return 1;
  }
}

export function energyKWh(hass: HomeAssistant, id?: string): number | undefined {
  const st = id ? hass.states[id] : undefined;
  if (!st || NO_VALUE.has(st.state)) return undefined;
  const v = parseFloat(st.state);
  if (!Number.isFinite(v)) return undefined;
  return v * energyFactorKWh(st.attributes.unit_of_measurement as string | undefined);
}

export function numState(hass: HomeAssistant, id?: string): number | undefined {
  const st = id ? hass.states[id] : undefined;
  if (!st || NO_VALUE.has(st.state)) return undefined;
  const v = parseFloat(st.state);
  return Number.isFinite(v) ? v : undefined;
}

/* ---------------- time ---------------- */

/** Local midnight in the Home Assistant time zone (falls back to the browser's). */
export function startOfToday(hass: HomeAssistant, now = new Date()): Date {
  const tz = (hass.config as unknown as { time_zone?: string })?.time_zone;
  if (!tz) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(now);
    const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second"));
    const offset = asUtc - Math.floor(now.getTime() / 1000) * 1000;
    return new Date(Date.UTC(g("year"), g("month") - 1, g("day")) - offset);
  } catch {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}

/* ---------------- recorder calls ---------------- */

async function stats(
  hass: HomeAssistant,
  ids: string[],
  start: Date,
  types: string[],
  units: Record<string, string>
): Promise<Record<string, StatRow[]>> {
  if (!ids.length) return {};
  try {
    return await hass.callWS<Record<string, StatRow[]>>({
      type: "recorder/statistics_during_period",
      start_time: start.toISOString(),
      statistic_ids: ids,
      period: "5minute",
      types,
      units,
    });
  } catch (e) {
    console.warn("energy-flow-card: statistics unavailable", e);
    return {};
  }
}

export async function history(
  hass: HomeAssistant,
  ids: string[],
  start: Date,
  end?: Date
): Promise<Record<string, HistRow[]>> {
  if (!ids.length) return {};
  try {
    const msg: { type: string; [k: string]: unknown } = {
      type: "history/history_during_period",
      start_time: start.toISOString(),
      entity_ids: ids,
      minimal_response: true,
      no_attributes: true,
      significant_changes_only: false,
    };
    if (end) msg.end_time = end.toISOString();
    return await hass.callWS<Record<string, HistRow[]>>(msg);
  } catch (e) {
    console.warn("energy-flow-card: history unavailable", e);
    return {};
  }
}

/** History rows → [epoch ms, value][] (non-numeric states dropped). */
export function histPoints(rows: HistRow[] | undefined, factor = 1): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (const r of rows ?? []) {
    const t = (r.lu ?? r.lc ?? 0) * 1000;
    const v = parseFloat(r.s);
    if (t && Number.isFinite(v)) out.push([t, v * factor]);
  }
  return out;
}

/** Sum of increases of a counter, treating a drop as a meter reset. */
function counterIncrease(points: Array<[number, number]>): number {
  let sum = 0;
  for (let i = 1; i < points.length; i++) {
    const d = points[i][1] - points[i - 1][1];
    sum += d >= 0 ? d : points[i][1];
  }
  return sum;
}

/** Left Riemann sum of W over time → kWh. */
function integrate(points: Array<[number, number]>, from: number, to: number): number {
  let kwh = 0;
  for (let i = 0; i < points.length; i++) {
    const t0 = Math.max(points[i][0], from);
    const t1 = Math.min(i + 1 < points.length ? points[i + 1][0] : to, to);
    if (t1 > t0) kwh += (points[i][1] * (t1 - t0)) / 3.6e9;
  }
  return kwh;
}

export interface DailyResult {
  bases: Record<string, EnergyBase>;
  /** Peak of the summed 5-minute max of `peakIds`, W. */
  peak: number | undefined;
}

/**
 * Fetch today's baselines.
 * @param counterIds cumulative energy sensors
 * @param powerIds   power sensors to integrate
 * @param peakIds    power sensors whose sum defines the "peak today"
 */
export async function fetchDaily(
  hass: HomeAssistant,
  counterIds: string[],
  powerIds: string[],
  peakIds: string[]
): Promise<DailyResult> {
  const now = Date.now();
  const midnight = startOfToday(hass, new Date(now));
  const bases: Record<string, EnergyBase> = {};
  const pIds = [...new Set([...powerIds, ...peakIds])];

  const [cStats, pStats] = await Promise.all([
    stats(hass, counterIds, midnight, ["change", "state"], { energy: "kWh" }),
    stats(hass, pIds, midnight, ["mean", "max"], { power: "W" }),
  ]);

  // ---- counters ----
  const noStatCounters: string[] = [];
  for (const id of counterIds) {
    const rows = cStats[id];
    if (!rows?.length) {
      noStatCounters.push(id);
      continue;
    }
    const base = rows.reduce((a, r) => a + (r.change ?? 0), 0);
    const last = rows[rows.length - 1].state;
    bases[id] = { kind: "counter", base, ref: last ?? undefined };
  }
  if (noStatCounters.length) {
    const h = await history(hass, noStatCounters, midnight);
    for (const id of noStatCounters) {
      const f = energyFactorKWh(hass.states[id]?.attributes.unit_of_measurement as string);
      const pts = histPoints(h[id], f);
      bases[id] = pts.length
        ? { kind: "counter", base: counterIncrease(pts), ref: pts[pts.length - 1][1] }
        : { kind: "counter", base: 0, ref: energyKWh(hass, id) };
    }
  }

  // ---- power integration ----
  let tailFrom = now;
  const statKwh: Record<string, number> = {};
  for (const id of powerIds) {
    const rows = pStats[id] ?? [];
    let kwh = 0;
    for (const r of rows) {
      if (r.mean == null) continue;
      kwh += (r.mean * (ms(r.end) - ms(r.start))) / 3.6e9;
    }
    statKwh[id] = kwh;
    if (rows.length) tailFrom = Math.min(tailFrom, ms(rows[rows.length - 1].end));
  }
  if (powerIds.length) {
    // Entities with statistics resume after the last compiled bucket; the rest from midnight.
    const withStats = powerIds.filter((id) => !!pStats[id]?.length);
    const full = powerIds.filter((id) => !pStats[id]?.length);
    const [tail, fullH] = await Promise.all([
      withStats.length ? history(hass, withStats, new Date(tailFrom)) : Promise.resolve({} as Record<string, HistRow[]>),
      full.length ? history(hass, full, midnight) : Promise.resolve({} as Record<string, HistRow[]>),
    ]);
    for (const id of powerIds) {
      const f = powerFactor(hass.states[id]?.attributes.unit_of_measurement as string);
      const hasStats = !!pStats[id]?.length;
      const from = hasStats ? ms(pStats[id][pStats[id].length - 1].end) : midnight.getTime();
      const pts = histPoints(hasStats ? tail[id] : fullH[id], f);
      const kwh = (statKwh[id] ?? 0) + integrate(pts, from, now);
      bases[id] = { kind: "power", base: kwh, t: now, p: powerW(hass, id) };
    }
  }

  // ---- peak ----
  let peak: number | undefined;
  if (peakIds.length) {
    const byStart = new Map<number, number>();
    for (const id of peakIds)
      for (const r of pStats[id] ?? []) {
        if (r.max == null) continue;
        const k = ms(r.start);
        byStart.set(k, (byStart.get(k) ?? 0) + r.max);
      }
    for (const v of byStart.values()) peak = Math.max(peak ?? 0, v);
  }

  return { bases, peak };
}

/** Today's kWh for an entity, using a baseline and the live state. */
export function todayKWh(hass: HomeAssistant, id: string, b: EnergyBase | undefined): number | undefined {
  if (!b) return undefined;
  if (b.kind === "counter") {
    const cur = energyKWh(hass, id);
    if (cur === undefined || b.ref === undefined) return b.base;
    return b.base + (cur >= b.ref ? cur - b.ref : cur);
  }
  return b.base;
}

/** Advance a power baseline with the current state (left Riemann, live). */
export function advancePower(hass: HomeAssistant, id: string, b: EnergyBase, now = Date.now()): void {
  if (b.kind !== "power") return;
  if (b.p !== undefined && now > b.t) b.base += (b.p * (now - b.t)) / 3.6e9;
  b.t = now;
  b.p = powerW(hass, id);
}
