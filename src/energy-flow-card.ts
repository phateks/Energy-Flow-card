import { LitElement, html, svg, nothing, PropertyValues, TemplateResult, SVGTemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, fireEvent } from "custom-card-helpers";
import {
  CARD_VERSION,
  ConsumerConfig,
  DEFAULT_LABELS,
  DEFAULTS,
  EnergyFlowCardConfig,
  Labels,
  METER_COLOR,
  MeterConfig,
  PALETTE,
  UNMEASURED_COLOR,
  VOLTAGE_COLORS,
} from "./types";
import { styles } from "./styles";
import {
  EnergyBase,
  advancePower,
  fetchDaily,
  histPoints,
  history,
  numState,
  powerW,
  startOfToday,
  todayKWh,
} from "./energy";

/* eslint-disable no-console */
console.info(
  `%c ENERGY-FLOW-CARD %c v${CARD_VERSION} `,
  "color:#16243a;background:#4ecdc4;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px;",
  "color:#4ecdc4;background:#16243a;font-weight:700;border-radius:0 4px 4px 0;padding:2px 6px;"
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "energy-flow-card",
  name: "Energy Flow Card",
  description:
    "Responsive power-flow card: meters with voltage gauge, today's kWh computed by the card, consumers with live power and daily energy, voltage history.",
  preview: true,
  documentationURL: "https://github.com/phateks/Energy-Flow-card",
});

/** Refresh recorder baselines (today's kWh, peak, voltage history) this often. */
const REFRESH_MS = 5 * 60 * 1000;
/** Breakpoints of the card's own width. */
const NARROW_MAX = 480;
const WIDE_MIN = 760;
/** Max points drawn in the voltage chart. */
const CHART_POINTS = 120;

interface Node {
  name: string;
  icon: string;
  color: string;
  power?: number;
  today?: number;
  entity?: string;
}

interface Meter {
  cfg: MeterConfig;
  name: string;
  icon: string;
  power?: number;
  voltage?: number;
  current?: number;
  today?: number;
}

const sum = (xs: Array<number | undefined>): number | undefined => {
  let s: number | undefined;
  for (const x of xs) if (x !== undefined) s = (s ?? 0) + x;
  return s;
};

const fmtP = (w?: number): string =>
  w === undefined ? "—" : Math.abs(w) >= 1000 ? `${(w / 1000).toFixed(2)} kW` : `${Math.round(w)} W`;
const fmtE = (k?: number): string =>
  k === undefined ? "—" : k < 10 ? k.toFixed(2) : k < 100 ? k.toFixed(1) : Math.round(k).toString();

@customElement("energy-flow-card")
export class EnergyFlowCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: EnergyFlowCardConfig;
  @state() private width = 0;
  @state() private rev = 0;

  private bases: Record<string, EnergyBase> = {};
  private peakBase?: number;
  private livePeak = 0;
  private vhist: Record<string, Array<[number, number]>> = {};
  private day?: number;
  private loading = false;
  private needsRefresh = true;
  private ro?: ResizeObserver;
  private timer?: number;

  public static styles = styles;

  public static async getConfigElement() {
    await import("./editor");
    return document.createElement("energy-flow-card-editor");
  }

  public static getStubConfig(hass?: HomeAssistant): EnergyFlowCardConfig {
    const sensors = Object.values(hass?.states ?? {}).filter((s) => s.entity_id.startsWith("sensor."));
    const byClass = (c: string) => sensors.filter((s) => s.attributes.device_class === c).map((s) => s.entity_id);
    const power = byClass("power");
    const voltage = byClass("voltage");
    const energy = byClass("energy");
    return {
      type: "custom:energy-flow-card",
      title: DEFAULTS.title,
      meters: [{ name: "Grid", power: power[0], voltage: voltage[0], energy: energy[0] }],
      consumers: power.slice(1, 3).map((p) => ({ power: p })),
    };
  }

  public setConfig(config: EnergyFlowCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    if (config.meters && !Array.isArray(config.meters)) throw new Error("`meters` must be a list");
    if (config.consumers && !Array.isArray(config.consumers)) throw new Error("`consumers` must be a list");
    this.config = { ...config };
    this.bases = {};
    this.vhist = {};
    this.peakBase = undefined;
    this.livePeak = 0;
    this.needsRefresh = true;
  }

  public getCardSize(): number {
    return 5;
  }

  public getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0]?.contentRect.width ?? 0);
      if (w && Math.abs(w - this.width) >= 1) this.width = w;
    });
    this.ro.observe(this);
    this.timer = window.setInterval(() => this.refresh(), REFRESH_MS);
    this.needsRefresh = true;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.ro?.disconnect();
    if (this.timer) clearInterval(this.timer);
  }

  /* ---------------- config helpers ---------------- */

  private get meters(): MeterConfig[] {
    return this.config?.meters ?? [];
  }
  private get consumers(): ConsumerConfig[] {
    return this.config?.consumers ?? [];
  }
  private get labels(): Labels {
    return { ...DEFAULT_LABELS, ...(this.config?.labels ?? {}) };
  }

  private trackedEntities(): string[] {
    const ids: string[] = [];
    for (const m of this.meters) ids.push(...[m.power, m.voltage, m.current, m.energy].filter(Boolean) as string[]);
    for (const c of this.consumers) ids.push(...[c.power, c.energy].filter(Boolean) as string[]);
    return ids;
  }

  private darkMode(hass?: HomeAssistant): boolean | undefined {
    return (hass?.themes as unknown as { darkMode?: boolean } | undefined)?.darkMode;
  }

  /* ---------------- lifecycle ---------------- */

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.has("config") || changed.has("width") || changed.has("rev")) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old || !this.hass) return true;
    if (this.darkMode(old) !== this.darkMode(this.hass)) return true;
    return this.trackedEntities().some((id) => old.states[id] !== this.hass.states[id]);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (!this.hass || !this.config) return;
    if (changed.has("hass")) {
      this.toggleAttribute("light", this.darkMode(this.hass) === false);
      const now = Date.now();
      for (const [id, b] of Object.entries(this.bases)) if (b.kind === "power") advancePower(this.hass, id, b, now);
      this.appendVoltage(now);
      const midnight = startOfToday(this.hass).getTime();
      if (this.day !== undefined && midnight !== this.day) this.needsRefresh = true;
    }
    if (this.needsRefresh) {
      this.needsRefresh = false;
      // Defer so a burst of setConfig/hass calls triggers a single fetch.
      setTimeout(() => this.refresh(), 0);
    }
  }

  protected firstUpdated(): void {
    if (!this.width) this.width = Math.round(this.getBoundingClientRect().width) || 360;
  }

  private appendVoltage(now: number): void {
    const hours = this.config.voltage_hours ?? DEFAULTS.voltage_hours;
    for (const m of this.meters) {
      if (!m.voltage) continue;
      const v = numState(this.hass, m.voltage);
      if (v === undefined) continue;
      const arr = (this.vhist[m.voltage] ??= []);
      const last = arr[arr.length - 1];
      if (!last || last[1] !== v || now - last[0] > 30000) arr.push([now, v]);
      const cut = now - hours * 3.6e6;
      while (arr.length > 2 && arr[1][0] < cut) arr.shift();
    }
  }

  private async refresh(): Promise<void> {
    if (!this.hass || !this.config || this.loading) return;
    this.loading = true;
    try {
      const counterIds: string[] = [];
      const powerIds: string[] = [];
      for (const x of [...this.meters, ...this.consumers]) {
        if (x.energy) counterIds.push(x.energy);
        else if (x.power) powerIds.push(x.power);
      }
      const meterPower = this.meters.map((m) => m.power).filter(Boolean) as string[];
      const peakIds = meterPower.length
        ? meterPower
        : (this.consumers.map((c) => c.power).filter(Boolean) as string[]);
      const hours = this.config.voltage_hours ?? DEFAULTS.voltage_hours;
      const vIds = this.meters.map((m) => m.voltage).filter(Boolean) as string[];

      const [daily, vh] = await Promise.all([
        fetchDaily(this.hass, [...new Set(counterIds)], [...new Set(powerIds)], peakIds),
        history(this.hass, vIds, new Date(Date.now() - hours * 3.6e6)),
      ]);
      this.bases = daily.bases;
      const midnight = startOfToday(this.hass).getTime();
      if (this.day !== midnight) this.livePeak = 0;
      this.day = midnight;
      this.peakBase = daily.peak;
      const vh2: Record<string, Array<[number, number]>> = {};
      for (const id of vIds) vh2[id] = histPoints(vh[id]);
      this.vhist = vh2;
      this.appendVoltage(Date.now());
      this.rev++;
    } finally {
      this.loading = false;
    }
  }

  private moreInfo(entityId?: string): void {
    if (entityId) fireEvent(this as any, "hass-more-info", { entityId });
  }

  /* ---------------- model ---------------- */

  private friendly(id?: string): string | undefined {
    return id ? (this.hass.states[id]?.attributes.friendly_name as string | undefined) : undefined;
  }

  private model() {
    const hass = this.hass;
    const meters: Meter[] = this.meters.map((m, j) => ({
      cfg: m,
      name: m.name ?? this.friendly(m.power ?? m.voltage ?? m.energy) ?? `Meter ${j + 1}`,
      icon: m.icon ?? (j === 0 ? "mdi:transmission-tower" : "mdi:home-lightning-bolt-outline"),
      power: powerW(hass, m.power),
      voltage: numState(hass, m.voltage),
      current: numState(hass, m.current),
      today: m.energy
        ? todayKWh(hass, m.energy, this.bases[m.energy])
        : m.power
        ? todayKWh(hass, m.power, this.bases[m.power])
        : undefined,
    }));
    // A consumer pointing at a meter's own sensor is the house total, not a load:
    // drop it so the total doesn't show up twice.
    const meterIds = new Set(this.meters.flatMap((m) => [m.power, m.energy]).filter(Boolean) as string[]);
    const consumerCfgs = this.consumers.filter(
      (c) => !(c.power && meterIds.has(c.power)) && !(c.energy && meterIds.has(c.energy))
    );
    const cons: Node[] = consumerCfgs.map((c, i) => {
      const ent = c.power ?? c.energy;
      return {
        name: c.name ?? this.friendly(ent) ?? `Load ${i + 1}`,
        icon: c.icon ?? (ent ? (hass.states[ent]?.attributes.icon as string | undefined) : undefined) ?? "mdi:flash",
        color: c.color ?? PALETTE[i % PALETTE.length],
        power: powerW(hass, c.power),
        today: c.energy
          ? todayKWh(hass, c.energy, this.bases[c.energy])
          : c.power
          ? todayKWh(hass, c.power, this.bases[c.power])
          : undefined,
        entity: ent,
      };
    });

    const meterP = sum(meters.map((m) => m.power));
    const meterE = sum(meters.map((m) => m.today));
    const consP = sum(cons.map((c) => c.power));
    const consE = sum(cons.map((c) => c.today));
    const totalP = meterP ?? consP;
    const totalE = meterE ?? consE;

    const nodes = [...cons];
    if (this.config.show_unmeasured !== false && cons.length > 0 && (meterP !== undefined || meterE !== undefined)) {
      nodes.push({
        name: this.config.unmeasured_name ?? DEFAULTS.unmeasured_name,
        icon: "mdi:help-circle-outline",
        color: UNMEASURED_COLOR,
        power: meterP !== undefined ? Math.max(0, meterP - (consP ?? 0)) : undefined,
        today: meterE !== undefined ? Math.max(0, meterE - (consE ?? 0)) : undefined,
      });
    }

    const currents = meters.map((m) =>
      m.current !== undefined ? m.current : m.power !== undefined && m.voltage ? m.power / m.voltage : undefined
    );
    const current = sum(currents) ?? (totalP !== undefined && meters[0]?.voltage ? totalP / meters[0].voltage : undefined);

    if (totalP !== undefined) this.livePeak = Math.max(this.livePeak, totalP);
    const peak = Math.max(this.peakBase ?? 0, this.livePeak) || undefined;

    return { meters, nodes, totalP, totalE, current, peak };
  }

  /* ---------------- render ---------------- */

  protected render(): TemplateResult | typeof nothing {
    if (!this.config || !this.hass) return nothing;
    const W = this.width || 360;
    const md = this.model();
    const narrow = W < NARROW_MAX;
    const wide = W >= WIDE_MIN;
    const inner = W - 26;
    const flowTileW = wide ? Math.round((inner - 7) * 0.64) : inner;
    const maxNodes = Math.max(3, this.config.max_flow_nodes ?? DEFAULTS.max_flow_nodes);
    const grouped = narrow && md.nodes.length > maxNodes;
    const L = this.labels;

    const header = html`
      <div class="header">
        <div class="title-icon"><ha-icon .icon=${this.config.icon ?? DEFAULTS.icon}></ha-icon></div>
        <div class="title-text">${this.config.title ?? DEFAULTS.title}</div>
        ${md.meters.length > 1 ? html`<span class="chip">Σ ${md.meters.length}</span>` : nothing}
        ${md.current !== undefined ? html`<span class="chip">${md.current.toFixed(1)} A</span>` : nothing}
        <span class="live ${md.totalP === undefined ? "stale" : ""}"></span>
      </div>
    `;

    const flow = this.renderFlow(md, flowTileW - 12, narrow, grouped, maxNodes, L);
    const list = grouped ? this.renderList(md.nodes, L) : nothing;
    const volt = this.renderVoltage(md.meters, L);

    if (wide) {
      const cmax = this.config.current_max ?? DEFAULTS.current_max;
      return html`<ha-card>
        ${header}
        <div class="body wide">
          <div class="tile flow wide" style="width:${flowTileW}px">${flow}</div>
          <div class="side">
            <div class="stats">
              <div class="tile stat">
                <div class="lab"><ha-icon icon="mdi:sine-wave" style="color:var(--efc-meter)"></ha-icon>${L.current}</div>
                <div class="v">${md.current !== undefined ? md.current.toFixed(1) : "—"}<span class="u">A</span></div>
                <div class="edge">
                  <span style="width:${Math.min(100, ((md.current ?? 0) / cmax) * 100).toFixed(0)}%;background:var(--efc-meter)"></span>
                </div>
              </div>
              <div class="tile stat">
                <div class="lab"><ha-icon icon="mdi:trending-up" style="color:var(--efc-warn)"></ha-icon>${L.peak_today}</div>
                <div class="v">${md.peak !== undefined ? (md.peak / 1000).toFixed(2) : "—"}<span class="u">kW</span></div>
              </div>
            </div>
            ${volt}
          </div>
        </div>
      </ha-card>`;
    }
    return html`<ha-card>
      ${header}
      <div class="stack">
        <div class="tile flow">${flow}</div>
        ${list}${volt}
      </div>
    </ha-card>`;
  }

  private renderFlow(
    md: ReturnType<EnergyFlowCard["model"]>,
    FW: number,
    narrow: boolean,
    grouped: boolean,
    maxNodes: number,
    L: Labels
  ): TemplateResult {
    let nodes = md.nodes;
    if (grouped) {
      const rest = nodes.slice(maxNodes - 2);
      nodes = [
        ...nodes.slice(0, maxNodes - 2),
        {
          name: L.rest,
          icon: "mdi:dots-horizontal",
          color: UNMEASURED_COLOR,
          power: sum(rest.map((n) => n.power)),
          today: sum(rest.map((n) => n.today)),
        },
      ];
    }
    const K = nodes.length;
    const cols = !narrow && K > 7 ? 2 : 1;
    const rows = Math.ceil(K / cols);
    const rowH = narrow ? 46 : 50;
    const top = 50;
    const xh = narrow ? 66 : Math.max(96, Math.round(FW * 0.18));
    const xc1 = narrow ? Math.min(170, Math.round(FW * 0.56)) : cols === 2 ? Math.round(FW * 0.43) : Math.round(FW * 0.5);
    const xc2 = Math.round(FW * 0.73);
    // Meter gauges + "Today" sit in the top-left corner; keep consumers clear of it.
    const N = md.meters.length;
    const r = 18;
    const gp = md.meters.map((_, j) => ({ x: 26 + 44 * j, y: 26 }));
    const ex = N ? gp[N - 1].x + r + 9 : 8;
    const reserve = ex + 85 > xc1 - 17 ? 56 : 0;
    const hyMin = top + 46;
    const H = Math.max(rows * rowH + (cols === 2 ? rowH / 2 : 0) + 16 + reserve, hyMin + 76);
    const hy = Math.max(hyMin, Math.round(H / 2 - 12));
    const cy = (reserve + H) / 2;
    const pos = nodes.map((_, i) => {
      if (cols === 1) return { x: xc1, y: Math.round(cy + (i - (K - 1) / 2) * rowH) };
      // Second-column rows sit half a row below the first-column rows, so their
      // lines run through the gaps of the first column.
      const c = i % 2;
      const rows1 = Math.ceil(K / 2);
      const k = Math.floor(i / 2);
      return { x: c ? xc2 : xc1, y: Math.round(cy + (k - (rows1 - 1) / 2) * rowH - rowH / 4 + (c ? rowH / 2 : 0)) };
    });

    const idle = this.config.idle_threshold ?? DEFAULTS.idle_threshold;
    const flowStyle = (w?: number) => {
      const on = w !== undefined && w > idle;
      const p = w ?? 0;
      return `opacity:${on ? 1 : 0};stroke-width:${(2 + Math.min(4, p / 500)).toFixed(1)}px;animation-duration:${Math.max(
        0.25,
        1.6 - p / 1800
      ).toFixed(2)}s`;
    };

    // ---- meters (corner gauges) ----
    const Cg = 2 * Math.PI * r;
    const vmin = this.config.voltage_min ?? DEFAULTS.voltage_min;
    const vmax = this.config.voltage_max ?? DEFAULTS.voltage_max;
    const meterSvg: SVGTemplateResult[] = [];
    const meterTracks: SVGTemplateResult[] = [];
    md.meters.forEach((m, j) => {
      const p = gp[j];
      const tx = xh + (j - (N - 1) / 2) * 16;
      const d = `M${p.x} ${p.y + r + 3} C${p.x} ${hy - 48} ${tx} ${hy - 58} ${tx} ${hy - 34}`;
      meterTracks.push(svg`<path class="track" d=${d}></path>`);
      meterSvg.push(svg`<path class="fp" d=${d} stroke=${METER_COLOR} style=${flowStyle(m.power)}></path>`);
      const frac =
        m.voltage === undefined
          ? 0
          : Math.max(0, Math.min(1, (m.voltage - DEFAULTS.gauge_min) / (DEFAULTS.gauge_max - DEFAULTS.gauge_min)));
      const ok = m.voltage === undefined || (m.voltage >= vmin && m.voltage <= vmax);
      meterSvg.push(svg`
        <circle class="ring-bg" cx=${p.x} cy=${p.y} r=${r} stroke-width="4"
          stroke-dasharray="${(Cg * 0.75).toFixed(1)} ${Cg.toFixed(1)}" stroke-linecap="round"
          transform="rotate(135 ${p.x} ${p.y})"></circle>
        <circle class="gauge" cx=${p.x} cy=${p.y} r=${r} stroke-width="4"
          stroke=${ok ? "var(--efc-ok)" : "var(--efc-warn)"}
          stroke-dasharray="${(Cg * 0.75 * frac).toFixed(1)} ${Cg.toFixed(1)}"
          transform="rotate(135 ${p.x} ${p.y})"></circle>`);
    });
    const todayEntity = md.meters.find((m) => m.cfg.energy)?.cfg.energy ?? md.meters[0]?.cfg.power;

    // ---- consumers ----
    const T = sum(nodes.map((n) => n.power)) ?? 0;
    const C = 2 * Math.PI * 30;
    let off = 0;
    const segs: SVGTemplateResult[] = [];
    const nodeTracks: SVGTemplateResult[] = [];
    const nodeSvg: SVGTemplateResult[] = [];
    nodes.forEach((n, i) => {
      const p = pos[i];
      const a = xh + 34;
      const b = p.x - 17;
      // Second-column nodes finish their bend before the first column, then run
      // straight through the gap between first-column rows.
      const bend = p.x === xc2 && cols === 2 ? xc1 - 26 : b;
      const m = (a + bend) / 2;
      const d =
        bend === b
          ? `M${a} ${hy} C${m} ${hy} ${m} ${p.y} ${b} ${p.y}`
          : `M${a} ${hy} C${m} ${hy} ${m} ${p.y} ${bend} ${p.y} L${b} ${p.y}`;
      nodeTracks.push(svg`<path class="track" d=${d}></path>`);
      nodeSvg.push(svg`<path class="fp" d=${d} stroke=${n.color} style=${flowStyle(n.power)}></path>
        <text class="t-sub" x=${p.x + 22} y=${p.y - 4}>${n.name}</text>
        <text x=${p.x + 22} y=${p.y + 12}
          ><tspan class="t-val">${fmtP(n.power)}</tspan
          >${n.today !== undefined
            ? svg`<tspan dx="6" style="fill:${n.color === UNMEASURED_COLOR ? "var(--efc-sub)" : n.color};font-size:11px;font-weight:600">${fmtE(
                n.today
              )} kWh</tspan>`
            : nothing}</text
        >`);
      const fr = T > 0 ? (n.power ?? 0) / T : 0;
      segs.push(svg`<circle class="seg" cx=${xh} cy=${hy} r="30" stroke-width="6" stroke=${n.color}
        stroke-dasharray="${Math.max(0, C * fr - 7).toFixed(1)} ${C.toFixed(1)}"
        stroke-dashoffset="${(-off - 3.5).toFixed(1)}"
        style="opacity:${fr > 0.02 ? 1 : 0}"></circle>`);
      off += C * fr;
    });

    return html`
      <div class="canvas" style="width:${FW}px;height:${H}px">
        <svg width=${FW} height=${H} viewBox="0 0 ${FW} ${H}">
          ${meterTracks}${nodeTracks}${meterSvg}${nodeSvg}
          <text class="t-sub" x=${ex} y="17">${L.today}</text>
          <text x=${ex} y="38"
            ><tspan class="t-today">${fmtE(md.totalE)}</tspan><tspan class="t-unit" dx="3">kWh</tspan></text
          >
          <circle class="ring-bg" cx=${xh} cy=${hy} r="30" stroke-width="6"></circle>
          <g transform="rotate(-90 ${xh} ${hy})">${segs}</g>
          <text class="t-big" x=${xh} y=${hy + 52} text-anchor="middle">${fmtP(md.totalP)}</text>
          <text class="t-sub" x=${xh} y=${hy + 66} text-anchor="middle">${L.now}</text>
        </svg>
        ${md.meters.map(
          (m, j) => html`<div
            class="meter-icon"
            title=${m.name}
            style="left:${gp[j].x - 18}px;top:${gp[j].y - 18}px"
            @click=${() => this.moreInfo(m.cfg.power ?? m.cfg.voltage ?? m.cfg.energy)}
          >
            <ha-icon .icon=${m.icon}></ha-icon>
          </div>`
        )}
        <div class="hit" style="left:${ex}px;top:4px;width:110px;height:40px" @click=${() => this.moreInfo(todayEntity)}></div>
        <div class="house" style="left:${xh - 20}px;top:${hy - 20}px"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon></div>
        ${nodes.map(
          (n, i) => html`<div
              class="node"
              title=${n.name}
              style="--c:${n.color};left:${pos[i].x - 14.5}px;top:${pos[i].y - 14.5}px"
              @click=${() => this.moreInfo(n.entity)}
            >
              <ha-icon .icon=${n.icon}></ha-icon>
            </div>
            <div
              class="hit"
              style="left:${pos[i].x + 18}px;top:${pos[i].y - 16}px;width:${Math.max(40, FW - pos[i].x - 18)}px;height:32px"
              @click=${() => this.moreInfo(n.entity)}
            ></div>`
        )}
      </div>
    `;
  }

  private renderList(nodes: Node[], L: Labels): TemplateResult {
    const useToday = nodes.some((n) => n.today !== undefined);
    const total = sum(nodes.map((n) => (useToday ? n.today : n.power))) ?? 0;
    return html`<div class="tile list">
      <div class="lrow head"><span></span><span></span><span></span><span>${L.now}</span><span>${L.today}</span></div>
      ${nodes.map((n) => {
        const v = (useToday ? n.today : n.power) ?? 0;
        return html`<div class="lrow" style="--c:${n.color}" @click=${() => this.moreInfo(n.entity)}>
          <ha-icon .icon=${n.icon}></ha-icon>
          <span class="lname">${n.name}</span>
          <span class="lbar"><span style="width:${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%"></span></span>
          <span class="lw">${fmtP(n.power)}</span>
          <span class="le" style=${n.color === UNMEASURED_COLOR ? "color:var(--efc-sub)" : ""}>${fmtE(n.today)}</span>
        </div>`;
      })}
    </div>`;
  }

  private renderVoltage(meters: Meter[], L: Labels): TemplateResult | typeof nothing {
    const vm = meters.filter((m) => m.cfg.voltage);
    if (!vm.length) return nothing;
    const hours = this.config.voltage_hours ?? DEFAULTS.voltage_hours;
    const now = Date.now();
    const t0 = now - hours * 3.6e6;
    const series = vm.map((m) => this.downsample((this.vhist[m.cfg.voltage!] ?? []).filter((p) => p[0] >= t0 - 60000), t0, now));
    const all = series.flat().map((p) => p[1]);
    const lo = all.length ? Math.min(...all) : undefined;
    const hi = all.length ? Math.max(...all) : undefined;
    let a = lo ?? 226;
    let b = hi ?? 234;
    if (b - a < 6) {
      const mid = (a + b) / 2;
      a = mid - 3;
      b = mid + 3;
    }
    const pad = (b - a) * 0.12;
    a -= pad;
    b += pad;
    const y = (v: number) => (40 - ((v - a) / (b - a)) * 40).toFixed(1);
    const x = (t: number) => (((t - t0) / (now - t0)) * 300).toFixed(1);
    const vmin = this.config.voltage_min ?? DEFAULTS.voltage_min;
    const vmax = this.config.voltage_max ?? DEFAULTS.voltage_max;
    const refs = [230, vmin, vmax].filter((v) => v > a && v < b);
    const win = hours >= 1 ? `${hours % 1 ? hours.toFixed(1) : hours}h` : `${Math.round(hours * 60)}min`;

    return html`<div class="tile volt">
      <div class="volt-head">
        <span class="lab"><ha-icon icon="mdi:sine-wave" style="color:var(--efc-ok)"></ha-icon>${L.voltage}</span>
        <span class="vnow">
          ${vm.map(
            (m, j) => html`<span style="color:${VOLTAGE_COLORS[j % VOLTAGE_COLORS.length]};cursor:pointer"
              @click=${() => this.moreInfo(m.cfg.voltage)}
              >${vm.length > 1 ? html`<span class="n">${m.name}</span>` : nothing}<b
                >${m.voltage !== undefined ? m.voltage.toFixed(1) : "—"}</b
              ><span class="uu">V</span></span
            >`
          )}
        </span>
      </div>
      <svg class="chart" viewBox="0 0 300 40" preserveAspectRatio="none">
        ${refs.map(
          (v) => svg`<line x1="0" x2="300" y1=${y(v)} y2=${y(v)} stroke="var(--efc-line)" stroke-width="1"
            stroke-dasharray="3 4" vector-effect="non-scaling-stroke"></line>`
        )}
        ${series.map(
          (s, j) => svg`<polyline fill="none" stroke=${VOLTAGE_COLORS[j % VOLTAGE_COLORS.length]} stroke-width="1.6"
            stroke-linejoin="round" vector-effect="non-scaling-stroke"
            points=${s.map((p) => `${x(p[0])},${y(p[1])}`).join(" ")}></polyline>`
        )}
      </svg>
      <div class="volt-foot">
        <span>${L.window.replace("{h}", win)}</span>
        <span>${lo !== undefined ? `min ${lo.toFixed(1)} · max ${hi!.toFixed(1)} V` : ""}</span>
      </div>
    </div>`;
  }

  /** Bucket-average a series into at most CHART_POINTS points across [t0, t1]. */
  private downsample(pts: Array<[number, number]>, t0: number, t1: number): Array<[number, number]> {
    if (pts.length <= CHART_POINTS) return pts.map(([t, v]) => [Math.max(t, t0), v]);
    const n = CHART_POINTS;
    const step = (t1 - t0) / n;
    const out: Array<[number, number]> = [];
    let k = 0;
    for (let i = 0; i < n; i++) {
      const end = t0 + (i + 1) * step;
      let s = 0;
      let c = 0;
      while (k < pts.length && pts[k][0] < end) {
        s += pts[k][1];
        c++;
        k++;
      }
      if (c) out.push([t0 + (i + 0.5) * step, s / c]);
    }
    return out;
  }
}
