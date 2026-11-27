import { country, definition, firstYear, indicators, lastYear, source, terms, years } from './data.js';

export { indicators };
export const getSeries = id => indicators.find(series => series.id === id);
export const valueAt = (series, year) => series.values[year - firstYear] ?? null;

const amount = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function displayValue(series, value, compact = false) {
  if (value === null) return 'Not available';
  if (series.kind === 'rate') return decimal.format(value).replace('-', '−') + '%';
  if (series.kind === 'people') return compact ? decimal.format(value / 1e6) + 'm' : amount.format(value);
  if (compact && series.kind === 'total-usd') return '$' + decimal.format(value / 1e12) + 'tn';
  return '$' + (compact ? amount : decimal).format(value);
}

export function yearChange(series, year) {
  const current = valueAt(series, year);
  const previous = valueAt(series, year - 1);
  if (current === null || previous === null || (previous === 0 && series.kind !== 'rate')) return null;
  const rate = series.kind === 'rate';
  const change = rate ? current - previous : ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(change) * 100) / 100;
  return (rounded === 0 ? '' : change < 0 ? '−' : '+') + decimal.format(rounded) + (rate ? ' pp' : '%');
}

export function selectRows(indicator = 'all', year = 'all') {
  const selectedSeries = indicator === 'all' ? indicators : indicators.filter(series => series.id === indicator);
  return years.toReversed().filter(y => year === 'all' || y === Number(year))
    .flatMap(y => selectedSeries.map(series => ({ year: y, series, value: valueAt(series, y) })));
}

function csvCell(value) {
  const item = value == null ? '' : String(value);
  return /[",\r\n]/.test(item) ? '"' + item.replaceAll('"', '""') + '"' : item;
}

export function encodeCsv(rows) {
  const header = ['country', 'year', 'indicator', 'series_code', 'unit', 'value', 'source', 'data_provider', 'definition_url', 'license', 'terms_url'];
  const lines = rows.map(({ year, series, value }) => [
    country, year, series.name, series.code, series.unit, value, source, series.provider, definition(series.code), 'CC BY 4.0', terms
  ]);
  return [header, ...lines].map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

export const explorerLink = (indicator = 'all', year = lastYear) => '#explore?indicator=' + indicator + '&year=' + year;
export const indicatorLink = (indicator, year = lastYear) => '#indicator/' + indicator + '?year=' + year;

export function readRoute(hash) {
  const [path, query] = hash.slice(1).split('?');
  const params = new URLSearchParams(query);
  const rawYear = params.get('year');
  const year = years.includes(Number(rawYear)) ? Number(rawYear) : lastYear;
  if (!path || path === 'overview') return { view: 'overview' };
  if (path === 'sources') return { view: 'sources' };
  if (path === 'explore') {
    const indicator = params.get('indicator');
    return { view: 'explore', indicator: getSeries(indicator) ? indicator : 'all', year: rawYear === 'all' ? 'all' : year };
  }
  const indicator = path.startsWith('indicator/') && getSeries(path.slice(10));
  return indicator ? { view: 'indicator', indicator: indicator.id, year } : { view: 'not-found' };
}
