import { years } from './data.js';

const abbreviate = n => Number(n.toFixed(2));
const coordinate = n => n.toFixed(1);

function paths(values, x, y) {
  const runs = [];
  let current = [];
  for (const [index, value] of values.entries()) {
    if (value === null) {
      if (current.length) runs.push(current);
      current = [];
    } else {
      current.push([coordinate(x(index)), coordinate(y(value))]);
    }
  }
  if (current.length) runs.push(current);
  return runs;
}

export function sparkline(values) {
  const observed = values.filter(value => value !== null);
  if (!observed.length) return '';
  const low = Math.min(...observed);
  const span = Math.max(...observed) - low || 1;
  const runs = paths(values, i => 3 + i * 8.4, v => 29 - (v - low) / span * 23);
  const tail = runs.at(-1).at(-1);
  return `<svg class="spark" viewBox="0 0 82 35" width="82" height="35" aria-hidden="true">
    <path d="M2 33H81" class="spark-grid"/>
    ${runs.map(run => `<polyline points="${run.join(' ')}"/>`).join('')}
    <circle cx="${tail[0]}" cy="${tail[1]}" r="2.8"/>
  </svg>`;
}

function scaleFor(values, includeZero) {
  const known = values.filter(value => value !== null);
  if (includeZero) known.push(0);
  const minimum = Math.min(...known);
  const maximum = Math.max(...known);
  const rough = (maximum - minimum || 1) / 4;
  const order = 10 ** Math.floor(Math.log10(rough));
  const step = ([1, 2, 2.5, 5, 10].find(k => k * order >= rough) || 10) * order;
  const bottom = Math.floor(minimum / step) * step;
  const top = Math.max(bottom + step, Math.ceil(maximum / step) * step);
  return { bottom, top, ticks: Array.from({ length: Math.round((top - bottom) / step) + 1 }, (_, i) => bottom + i * step) };
}

export function trendChart(series, { year, featured = false }) {
  const bars = ['inflation', 'growth'].includes(series.id);
  const divisor = { people: 1e6, 'total-usd': 1e12, 'person-usd': 1e3 }[series.kind] ?? 1;
  const values = series.values.map(value => value === null ? null : value / divisor);
  if (values.every(value => value === null)) return '<p>No observations are available for this chart.</p>';
  const { top, bottom, ticks } = scaleFor(values, series.kind === 'rate');
  const left = 44, right = 511, upper = 17;
  const lower = featured ? 117 : 171;
  const spacing = (right - left) / years.length;
  const x = index => left + spacing * (index + 0.5);
  const y = value => lower - (value - bottom) / (top - bottom) * (lower - upper);
  const selected = years.indexOf(year);
  const run = bars ? '' : paths(values, x, y).map(segment => `<polyline class="trend-line" points="${segment.join(' ')}"/>`).join('');
  const yearLabels = new Set(featured ? [2015, 2018, 2020, 2022, 2024] :
    [years[0], ...[2017, 2019, 2021].filter(tick => Math.abs(tick - year) > 1), year, years.at(-1)]);
  const marks = values.map((value, index) => {
    if (value === null) return '';
    const cx = x(index);
    const cy = y(value);
    const active = index === selected ? ' is-selected' : '';
    if (!bars) return `<circle class="plot-dot${active}" cx="${cx}" cy="${cy}" r="${active ? 5 : 3.5}"/>`;
    const zero = y(0);
    return `<rect class="plot-bar${active}" x="${cx - 13}" y="${Math.min(cy, zero) - (value === 0 ? 1 : 0)}" width="26" height="${Math.abs(zero - cy) || 2}" rx="2"/>`;
  });
  return `<svg class="trend" viewBox="0 0 520 ${lower + 31}" aria-hidden="true" focusable="false">
    ${ticks.map(tick => `<path d="M${left} ${y(tick)} H${right}" class="${tick === 0 ? 'axis-zero' : 'axis-grid'}"/>
      <text x="36" y="${y(tick) + 5}" text-anchor="end">${abbreviate(tick)}</text>`).join('')}
    ${selected >= 0 && !featured ? `<path class="selected-guide" d="M${x(selected)} ${upper}V${lower}"/>` : ''}
    ${run}${marks.join('')}
    ${years.map((tick, i) => yearLabels.has(tick) ? `<text x="${x(i)}" y="${lower + 22}" text-anchor="middle" class="${i === selected ? 'year-selected' : ''}">${tick}</text>` : '').join('')}
  </svg>`;
}
