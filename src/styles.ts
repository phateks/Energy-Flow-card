import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    min-width: 0;
    --efc-txt: #e8eef6;
    --efc-sub: #8aa0bd;
    --efc-title: #dbe6f3;
    --efc-accent: #4ecdc4;
    --efc-ok: #5dcaa5;
    --efc-warn: #ff8a5c;
    --efc-meter: #8fb3ff;
    --efc-surface: color-mix(in srgb, #9fb6d6 6%, transparent);
    --efc-surface-hi: color-mix(in srgb, #9fb6d6 10%, transparent);
    --efc-line: color-mix(in srgb, #9fb6d6 14%, transparent);
    --efc-chip: color-mix(in srgb, #9fb6d6 12%, transparent);
    --efc-border: #26425f;
    --efc-radius: 18px;
    --efc-tile-radius: 13px;
    --efc-gap: 7px;
  }

  /* Light HA theme: keep the accents, switch text/surfaces to theme colours. */
  :host([light]) {
    --efc-txt: var(--primary-text-color, #1c2733);
    --efc-sub: var(--secondary-text-color, #5b6b7d);
    --efc-title: var(--primary-text-color, #1c2733);
    --efc-border: var(--divider-color, #d5dee8);
    --efc-accent: #1fa99f;
    --efc-ok: #2fa57e;
    --efc-warn: #f0703c;
    --efc-meter: #4f7fd6;
    --efc-surface: color-mix(in srgb, #3c5a80 5%, transparent);
    --efc-surface-hi: color-mix(in srgb, #3c5a80 8%, transparent);
    --efc-line: color-mix(in srgb, #3c5a80 12%, transparent);
    --efc-chip: color-mix(in srgb, #3c5a80 9%, transparent);
  }

  ha-card {
    background: var(--ha-card-background, var(--card-background-color, none));
    border: 1px solid var(--efc-border);
    border-radius: var(--efc-radius);
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.25);
    padding: 12px;
    color: var(--efc-txt);
    overflow: hidden;
    position: relative;
    font-variant-numeric: tabular-nums;
    box-sizing: border-box;
  }

  /* ---------- header ---------- */
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    min-width: 0;
  }
  .title-icon {
    width: 34px;
    height: 34px;
    border-radius: 11px;
    background: color-mix(in srgb, var(--efc-accent) 16%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .title-icon ha-icon { --mdc-icon-size: 20px; color: var(--efc-accent); }
  .title-text {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--efc-title);
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chip {
    flex-shrink: 0;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.3px;
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--efc-chip);
    color: var(--efc-sub);
    white-space: nowrap;
    line-height: 18px;
  }
  .live {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--efc-ok);
    animation: ping 1.8s ease-out infinite;
  }
  .live.stale { background: var(--efc-sub); animation: none; opacity: 0.6; }
  @keyframes ping {
    0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--efc-ok) 60%, transparent); }
    100% { box-shadow: 0 0 0 6px transparent; }
  }

  /* ---------- tiles ---------- */
  .tile {
    background: var(--efc-surface);
    border-radius: var(--efc-tile-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    min-width: 0;
  }
  .lab {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.7px;
    color: var(--efc-sub);
    text-transform: uppercase;
    white-space: nowrap;
  }
  .lab ha-icon { --mdc-icon-size: 15px; }

  .body.wide { display: flex; gap: var(--efc-gap); align-items: stretch; }
  .side { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: var(--efc-gap); }
  .stack > * + * { margin-top: var(--efc-gap); }

  /* ---------- flow ---------- */
  .flow { padding: 6px; }
  .flow.wide { flex: 0 0 auto; }
  .canvas { position: relative; }
  .canvas svg { position: absolute; inset: 0; overflow: visible; }
  .track { fill: none; stroke: var(--efc-line); stroke-width: 7; stroke-linecap: round; }
  .fp {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 0.1 10;
    animation: flow linear infinite;
    transition: stroke-width 0.5s, opacity 0.4s;
  }
  @keyframes flow { to { stroke-dashoffset: -20; } }
  .ring-bg { fill: none; stroke: var(--efc-line); }
  .seg { fill: none; stroke-linecap: round; transition: stroke-dasharray 0.6s, stroke-dashoffset 0.6s, opacity 0.4s; }
  .gauge { fill: none; stroke-linecap: round; transition: stroke-dasharray 0.8s, stroke 0.4s; }
  .t-sub { fill: var(--efc-sub); font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .t-val { fill: var(--efc-txt); font-size: 13.5px; font-weight: 600; }
  .t-big { fill: var(--efc-txt); font-size: 17px; font-weight: 700; }
  .t-today { fill: var(--efc-accent); font-size: 20px; font-weight: 700; }
  .t-unit { fill: var(--efc-sub); font-size: 10px; font-weight: 600; }

  .node {
    position: absolute;
    width: 29px;
    height: 29px;
    border-radius: 50%;
    border: 1.5px solid var(--c);
    color: var(--c);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background: color-mix(in srgb, var(--c) 8%, transparent);
    cursor: pointer;
  }
  .node ha-icon { --mdc-icon-size: 16px; }
  .house {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--efc-surface-hi);
    color: var(--efc-title);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .house ha-icon { --mdc-icon-size: 22px; }
  .meter-icon {
    position: absolute;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--efc-meter);
    cursor: pointer;
  }
  .meter-icon ha-icon { --mdc-icon-size: 17px; }
  .hit { position: absolute; cursor: pointer; }

  /* ---------- list (narrow, many consumers) ---------- */
  .list { padding: 6px 10px; }
  .lrow {
    display: grid;
    grid-template-columns: 18px minmax(0, 1.1fr) minmax(0, 1fr) 52px 48px;
    align-items: center;
    gap: 6px;
    padding: 3px 0;
    font-size: 12px;
    cursor: pointer;
  }
  .lrow.head { cursor: default; padding-bottom: 1px; }
  .lrow.head span { text-transform: uppercase; font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; color: var(--efc-sub); text-align: right; }
  .lrow ha-icon { --mdc-icon-size: 15px; color: var(--c); }
  .lname { font-size: 10px; font-weight: 700; letter-spacing: 0.4px; color: var(--efc-sub); text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .lbar { height: 4px; border-radius: 2px; background: var(--efc-line); overflow: hidden; }
  .lbar > span { display: block; height: 100%; background: var(--c); transition: width 0.5s; }
  .lw { text-align: right; font-weight: 600; }
  .le { text-align: right; font-weight: 600; color: var(--c); }

  /* ---------- small tiles (wide) ---------- */
  .stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--efc-gap); }
  .stat { padding: 8px 10px 11px; }
  .stat .v { text-align: right; font-size: 23px; font-weight: 600; line-height: 1; margin-top: 6px; white-space: nowrap; }
  .u { font-size: 0.5em; font-weight: 600; color: var(--efc-sub); margin-left: 2px; }
  .edge { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--efc-line); }
  .edge > span { position: absolute; left: 0; top: 0; bottom: 0; transition: width 0.5s; }

  /* ---------- voltage ---------- */
  .volt { padding: 8px 10px 6px; display: flex; flex-direction: column; }
  .volt-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .vnow { display: flex; align-items: baseline; gap: 10px; white-space: nowrap; }
  .vnow b { font-size: 15px; font-weight: 700; }
  .vnow .n { font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; color: var(--efc-sub); margin-right: 3px; text-transform: uppercase; }
  .vnow .uu { font-size: 10px; color: var(--efc-sub); margin-left: 2px; }
  .chart { width: 100%; height: 40px; display: block; margin-top: 4px; flex: 1 1 auto; min-height: 36px; }
  .side .volt { flex: 1 1 auto; }
  .side .volt .chart { height: auto; }
  .volt-foot { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--efc-sub); margin-top: 2px; }

  .warn { padding: 8px 4px; font-size: 13px; color: var(--efc-sub); }
`;
