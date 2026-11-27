import { country, definition, firstYear, indicators, lastYear, licence, terms, years } from './data.js';
import { displayValue, explorerLink, getSeries, indicatorLink, selectRows, valueAt, yearChange } from './statistics.js';
import { sparkline, trendChart } from './charts.js';

const period = firstYear + '–' + lastYear;
const wdi = 'World Bank WDI';
const catalogue = 'https://datacatalog.worldbank.org/infrastructure-data/search/dataset/0037712/world-development-indicators';
const sourceStamp = year => `<span>${year} <span aria-hidden="true">·</span> ${wdi}</span>`;
const options = (items, selected) => items.map(([value, label]) =>
  `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`).join('');
const yearOptions = years.toReversed().map(year => [year, year]);

function metricCard(series) {
  return `<a class="metric" href="${indicatorLink(series.id)}">
    <div class="metric-heading"><span>${series.name}</span><span class="metric-tag">${series.group}</span></div>
    <div class="metric-reading">
      <div><strong>${displayValue(series, valueAt(series, lastYear), true)}</strong><span class="unit">${series.shortUnit}</span></div>
      ${sparkline(series.values)}
    </div>
    <div class="metric-foot">${sourceStamp(lastYear)}<span class="metric-action">Trend</span></div>
  </a>`;
}

export function overview() {
  const series = getSeries('inflation');
  const peak = Math.max(...series.values.filter(value => value !== null));
  const year = years[series.values.indexOf(peak)];
  return `<section class="lead" aria-labelledby="overview-title">
    <div class="lead-copy">
      <p class="eyebrow"><span class="short-rule"></span> The national picture <span class="issue">${period}</span></p>
      <h1 id="overview-title">United<span class="title-break"> </span>Kingdom<span class="title-stop">.</span></h1>
      <p class="lead-dek">A decade of data on people, output, prices and work.</p>
      <a class="button primary" href="${explorerLink()}">Explore the data</a>
    </div>
    <figure class="lead-chart">
      <div class="figure-head">
        <div><p class="eyebrow">In focus</p><h2>CPI inflation</h2><p class="figure-unit">Annual change in consumer prices (%)</p></div>
        <div class="peak"><strong>${displayValue(series, peak)}</strong><span>${year} peak</span></div>
      </div>
      ${trendChart(series, { year, featured: true })}
      <figcaption class="lead-chart-caption">
        <span>${wdi} · ${period}</span>
        <a href="${indicatorLink(series.id, year)}">Inspect this series</a>
      </figcaption>
    </figure>
  </section>
  <section class="pulse" aria-labelledby="pulse-title">
    <div class="section-head">
      <div><p class="eyebrow">The reference year</p><h2 id="pulse-title">${lastYear} at a glance</h2></div>
      <span class="section-aside">6 indicators <span aria-hidden="true">/</span> UK totals and rates</span>
    </div>
    <div class="metrics">${indicators.map(metricCard).join('')}</div>
  </section>`;
}

export function indicatorDetail(id, year) {
  const series = getSeries(id);
  const value = valueAt(series, year);
  const difference = yearChange(series, year);
  return `<div class="subpage">
    <a class="crumb" href="#overview">Overview</a><span class="crumb-divider" aria-hidden="true">/</span><span class="crumb-current">${series.group}</span>
    <div class="subpage-head">
      <div><p class="eyebrow">UK indicator <span aria-hidden="true">/</span> ${period}</p>
        <h1>${series.name}</h1><p>${series.explanation}</p></div>
      <label class="field" for="detail-series">Indicator
        <select id="detail-series">${options(indicators.map(item => [item.id, item.name]), id)}</select>
      </label>
    </div>
    <div class="detail-grid">
      <figure class="detail-chart panel">
        <div class="figure-head">
          <div><p class="eyebrow">Annual series</p><h2>${period}</h2><p class="figure-unit">${series.axis}</p></div>
          <label class="field" for="detail-year">Inspect year
            <select id="detail-year">${options(yearOptions, year)}</select>
          </label>
        </div>
        ${trendChart(series, { year })}
        <figcaption class="chart-caption">${wdi} · ${period}. Use the year selector for a reading, or <a href="${explorerLink(id, 'all')}">view all annual values</a>.</figcaption>
      </figure>
      <aside class="reading panel" aria-label="Selected observation and interpretation">
        <p class="eyebrow">${year} observation</p>
        <p class="stat-big" id="current-value">${displayValue(series, value)}</p>
        <p class="reading-unit">${series.unit}</p>
        ${difference ? `<p class="delta"><strong>${difference}</strong> vs ${year - 1}</p>` : ''}
        <p class="reading-source">${sourceStamp(year)} · ${series.code}</p>
        <hr>
        <h2>How to read it</h2><p>${series.caution}</p>
        <a class="text-link" href="${definition(series.code)}">World Bank definition</a>
      </aside>
    </div>
    <div class="data-note"><p><strong>Data credit:</strong> World Bank: World Development Indicators: ${series.provider}.</p><a href="#sources">Methodology and licence</a></div>
  </div>`;
}

export function explorer(indicator, year) {
  const rows = selectRows(indicator, year);
  const title = indicator === 'all' ? 'All indicators' : getSeries(indicator).name;
  const window = year === 'all' ? period : year;
  return `<div class="subpage">
    <p class="eyebrow">United Kingdom <span aria-hidden="true">/</span> ${period}</p>
    <div class="subpage-head explorer-head">
      <div><h1>Data explorer</h1><p>Filter the annual series, then download the same selection.</p></div>
      <button class="button primary" id="download" type="button"${rows.length ? '' : ' disabled'}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Download CSV
      </button>
    </div>
    <section class="panel explorer-panel" aria-labelledby="results-title">
      <div class="filters">
        <label class="field" for="filter-indicator">Indicator
          <select id="filter-indicator">${options([['all', 'All indicators'], ...indicators.map(item => [item.id, item.name])], indicator)}</select>
        </label>
        <label class="field" for="filter-year">Reference year
          <select id="filter-year">${options([['all', 'All years'], ...yearOptions], year)}</select>
        </label>
        <a class="reset" href="${explorerLink()}" id="reset-filters">Reset filters</a>
      </div>
      <div class="results-head">
        <h2 id="results-title">${title} <span aria-hidden="true">/</span> ${window}</h2>
        <p id="row-count">${rows.length} ${rows.length === 1 ? 'observation' : 'observations'}</p>
      </div>
      <table class="observations">
        <caption class="visually-hidden">United Kingdom, ${title}, ${window}. Source: World Bank World Development Indicators.</caption>
        <thead><tr><th scope="col">Year</th><th scope="col">Indicator</th><th scope="col" class="align-end">Value</th><th scope="col">Source</th></tr></thead>
        <tbody>${rows.map(({ series, year: date, value }) => `<tr>
          <td>${date}</td>
          <th scope="row"><a href="${indicatorLink(series.id, date)}">${series.name}</a><span class="table-unit">${series.id === 'unemployment' ? 'Modelled ILO · ' : ''}${series.unit}</span></th>
          <td class="align-end numeric">${displayValue(series, value)}</td>
          <td><a href="${definition(series.code)}" aria-label="World Bank definition: ${series.name}">WDI</a></td>
        </tr>`).join('')}</tbody>
      </table>
      ${rows.length ? '' : '<p class="results-head">No observations match those filters.</p>'}
    </section>
    <div class="data-note"><p>Table figures are rounded for display. The CSV keeps source precision, units and credits.</p><a href="#sources">About these data</a></div>
  </div>`;
}

export function sources() {
  return `<div class="subpage">
    <p class="eyebrow">Transparency <span aria-hidden="true">/</span> ${country}</p>
    <div class="subpage-head"><div><h1>Sources &amp; method</h1><p>Where the figures come from, what they measure, and how to reuse them.</p></div></div>
    <div class="methods-grid">
      <section class="panel method">
        <p class="eyebrow">Coverage</p><h2>A fixed historical window</h2>
        <p>Six annual indicators for the United Kingdom (GBR) from ${firstYear} to ${lastYear}. This is a national extract, not a live feed, forecast, or breakdown by nation or region.</p>
        <p>The World Bank API marked the WDI source updated 11 November 2026. This extract was retrieved 27 November 2026. Neither date is an observation year.</p>
        <p>A missing value is shown as “Not available” and left blank in CSV. Charts do not bridge gaps. Changes in rates use percentage points (pp); changes in levels use relative percentages.</p>
      </section>
      <section class="panel method">
        <p class="eyebrow">Reuse</p><h2>Open data, credited</h2>
        <p>World Bank: <a href="${catalogue}">World Development Indicators</a>: providers listed below. The series metadata specifies <a href="${licence}">CC BY 4.0</a> with the <a href="${terms}">World Bank dataset terms</a>.</p>
        <p>UK Signal selects a subset, rewrites labels, rounds display figures and calculates comparisons. CSV observation values are unchanged. It is independent and not endorsed by the data providers.</p>
        <a class="text-link" href="${explorerLink('all', 'all')}">Browse all 60 observations</a>
      </section>
    </div>
    <section aria-labelledby="registry-title" class="registry">
      <div class="section-head"><h2 id="registry-title">Series register</h2><span class="section-aside">World Bank WDI · ${period}</span></div>
      <div class="methods-grid">${indicators.map(series => `<article class="panel method">
        <p class="eyebrow">${series.code}</p><h3>${series.name}</h3>
        <p>${series.explanation} <strong>Unit:</strong> ${series.unit}.</p><p class="credit">${series.provider}.</p>
        <p class="series-links"><a href="${definition(series.code)}">Source definition</a><a href="${indicatorLink(series.id)}">UK trend</a></p>
      </article>`).join('')}</div>
    </section>
  </div>`;
}

export function notFound() {
  return '<div class="subpage"><p class="eyebrow">UK Signal</p><h1>View not found</h1><p>That address does not match a UK Signal view.</p><a class="button primary" href="#overview">Return to overview</a></div>';
}
