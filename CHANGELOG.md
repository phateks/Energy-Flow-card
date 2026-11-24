# Changelog

## [0.1.1] - 2026-11-24

### Fixed
- A consumer that uses a meter's own sensor (the house total) is ignored, so the
  total no longer appears twice as a consumer.
- The Unmeasured node is only shown when at least one real consumer is configured.

## [0.1.0] - 2026-11-24

### Added
- First release: meters with corner voltage gauges, today's kWh computed from the
  recorder (energy statistics or integrated power), consumers with live power and
  daily energy, automatic unmeasured node, responsive phone / tablet / desktop
  layouts, voltage history chart, current and peak tiles, visual editor.
