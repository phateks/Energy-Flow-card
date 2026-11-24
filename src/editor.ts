import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, LovelaceCardEditor, fireEvent } from "custom-card-helpers";
import { ConsumerConfig, DEFAULTS, EnergyFlowCardConfig, MeterConfig } from "./types";

const ent = (name: string, device_class?: string) => ({
  name,
  selector: { entity: device_class ? { domain: "sensor", device_class } : { domain: "sensor" } },
});
const text = (name: string) => ({ name, selector: { text: {} } });
const num = (name: string, step = 1) => ({ name, selector: { number: { mode: "box", step } } });
const grid = (schema: unknown[]) => ({ type: "grid", name: "", schema });

const MAIN_SCHEMA = [
  grid([text("title"), { name: "icon", selector: { icon: {} } }]),
  ent("total_power", "power"),
  ent("total_energy", "energy"),
  grid([{ name: "show_unmeasured", selector: { boolean: {} } }, text("unmeasured_name")]),
  grid([num("max_flow_nodes"), num("voltage_hours", 0.5)]),
  grid([num("voltage_min"), num("voltage_max")]),
  grid([num("current_max"), num("idle_threshold")]),
];

const METER_SCHEMA = [
  grid([text("name"), { name: "icon", selector: { icon: {} } }]),
  ent("power", "power"),
  ent("energy", "energy"),
  ent("voltage", "voltage"),
  ent("current", "current"),
];

const CONSUMER_SCHEMA = [
  grid([text("name"), { name: "icon", selector: { icon: {} } }]),
  ent("power", "power"),
  ent("energy", "energy"),
  text("color"),
];

const LABELS: Record<string, string> = {
  title: "Title",
  icon: "Icon",
  total_power: "House total power sensor (optional – read as is, not summed)",
  total_energy: "House total energy sensor (optional – preferred for Today)",
  show_unmeasured: "Show unmeasured (meters − consumers)",
  unmeasured_name: "Unmeasured name",
  max_flow_nodes: `Phone: max nodes before grouping (default ${DEFAULTS.max_flow_nodes})`,
  voltage_hours: `Voltage chart window, hours (default ${DEFAULTS.voltage_hours})`,
  voltage_min: `Normal voltage from (default ${DEFAULTS.voltage_min} V)`,
  voltage_max: `Normal voltage to (default ${DEFAULTS.voltage_max} V)`,
  current_max: `Current bar full scale (default ${DEFAULTS.current_max} A)`,
  idle_threshold: `Idle below (default ${DEFAULTS.idle_threshold} W)`,
  name: "Name",
  power: "Power sensor (W / kW)",
  energy: "Energy sensor (kWh, optional – preferred for Today)",
  voltage: "Voltage sensor (V)",
  current: "Current sensor (A, optional)",
  color: "Color (optional, e.g. #4ecdc4)",
};

const clean = <T extends object>(o: T): T => {
  const c = { ...o } as Record<string, unknown>;
  for (const k of Object.keys(c)) if (c[k] === "" || c[k] === undefined || c[k] === null) delete c[k];
  return c as T;
};

@customElement("energy-flow-card-editor")
export class EnergyFlowCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: EnergyFlowCardConfig;

  public setConfig(config: EnergyFlowCardConfig): void {
    this._config = config;
  }

  private _label = (s: { name: string }) => LABELS[s.name] ?? s.name;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const meters = this._config.meters ?? [];
    const consumers = this._config.consumers ?? [];
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${MAIN_SCHEMA}
        .computeLabel=${this._label}
        @value-changed=${this._mainChanged}
      ></ha-form>

      <div class="section">Meters</div>
      ${meters.map((m, i) => this._item("meters", i, m, METER_SCHEMA, m.name || m.power || `Meter ${i + 1}`))}
      <button class="add" @click=${() => this._add("meters")}>+ Add meter</button>

      <div class="section">Consumers</div>
      ${consumers.map((c, i) =>
        this._item("consumers", i, c, CONSUMER_SCHEMA, c.name || c.power || c.energy || `Consumer ${i + 1}`)
      )}
      <button class="add" @click=${() => this._add("consumers")}>+ Add consumer</button>
    `;
  }

  private _item(
    key: "meters" | "consumers",
    i: number,
    data: MeterConfig | ConsumerConfig,
    schema: unknown[],
    title: string
  ): TemplateResult {
    const list = this._config[key] ?? [];
    return html`<ha-expansion-panel outlined .header=${title}>
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this._label}
        @value-changed=${(ev: CustomEvent) => this._itemChanged(key, i, ev)}
      ></ha-form>
      <div class="row">
        <button ?disabled=${i === 0} @click=${() => this._move(key, i, -1)}>↑</button>
        <button ?disabled=${i === list.length - 1} @click=${() => this._move(key, i, 1)}>↓</button>
        <button class="del" @click=${() => this._remove(key, i)}>Remove</button>
      </div>
    </ha-expansion-panel>`;
  }

  private _emit(config: EnergyFlowCardConfig): void {
    this._config = config;
    fireEvent(this as any, "config-changed", { config });
  }

  private _mainChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const v = clean(ev.detail.value as EnergyFlowCardConfig);
    this._emit({ ...v, meters: this._config.meters, consumers: this._config.consumers });
  }

  private _itemChanged(key: "meters" | "consumers", i: number, ev: CustomEvent): void {
    ev.stopPropagation();
    const list = [...(this._config[key] ?? [])];
    list[i] = clean(ev.detail.value);
    this._emit({ ...this._config, [key]: list });
  }

  private _add(key: "meters" | "consumers"): void {
    this._emit({ ...this._config, [key]: [...(this._config[key] ?? []), {}] });
  }

  private _remove(key: "meters" | "consumers", i: number): void {
    const list = [...(this._config[key] ?? [])];
    list.splice(i, 1);
    this._emit({ ...this._config, [key]: list });
  }

  private _move(key: "meters" | "consumers", i: number, d: number): void {
    const list = [...(this._config[key] ?? [])];
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    this._emit({ ...this._config, [key]: list });
  }

  static styles = css`
    .section {
      margin: 18px 0 6px;
      font-weight: 600;
      font-size: 15px;
    }
    ha-expansion-panel {
      display: block;
      margin-bottom: 8px;
      --expansion-panel-content-padding: 8px 12px;
    }
    .row {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      font: inherit;
      font-size: 13px;
      padding: 4px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button.del {
      color: var(--error-color, #db4437);
    }
    button.add {
      width: 100%;
      padding: 8px;
      border-style: dashed;
    }
  `;
}
