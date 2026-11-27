import { encodeCsv, explorerLink, indicatorLink, readRoute, selectRows } from './statistics.js';
import { explorer, indicatorDetail, notFound, overview, sources } from './views.js';

const content = document.querySelector('#content');
const menu = document.querySelector('#menu');
const nav = document.querySelector('#navigation');
const skip = document.querySelector('#skip');
const routeLabels = { overview: 'United Kingdom in numbers', indicator: 'Indicator trend', explore: 'Data explorer', sources: 'Sources & method', 'not-found': 'View not found' };
let route;
let retainFocus = '';

function toggleMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
}

function renderRoute(navigate = false) {
  const previous = route;
  route = readRoute(location.hash);
  if (route.view === 'overview') content.innerHTML = overview();
  if (route.view === 'indicator') content.innerHTML = indicatorDetail(route.indicator, route.year);
  if (route.view === 'explore') content.innerHTML = explorer(route.indicator, route.year);
  if (route.view === 'sources') content.innerHTML = sources();
  if (route.view === 'not-found') content.innerHTML = notFound();

  const pageTitle = route.view === 'indicator' ? content.querySelector('h1').textContent : routeLabels[route.view];
  document.title = 'UK Signal — ' + pageTitle;
  const active = route.view === 'indicator' ? 'overview' : route.view;
  for (const anchor of nav.querySelectorAll('[data-nav]')) {
    if (anchor.dataset.nav === active) anchor.setAttribute('aria-current', route.view === active ? 'page' : 'location');
    else anchor.removeAttribute('aria-current');
  }

  toggleMenu(false);
  if (retainFocus) {
    document.getElementById(retainFocus)?.focus({ preventScroll: true });
    retainFocus = '';
  } else if (navigate) {
    if (previous?.view !== route.view || previous?.indicator !== route.indicator) window.scrollTo(0, 0);
    content.focus({ preventScroll: true });
  }
}

function downloadSelection() {
  const rows = selectRows(route.indicator, route.year);
  const blob = new Blob([encodeCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'uk-signal-' + route.indicator + '-' + (route.year === 'all' ? '2015-2024' : route.year) + '.csv';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

skip.addEventListener('click', () => content.focus());
menu.addEventListener('click', () => toggleMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  if (link.hash === location.hash || (link.hash === '#overview' && !location.hash)) {
    toggleMenu(false);
    if (getComputedStyle(menu).display !== 'none') content.focus();
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    toggleMenu(false);
    menu.focus();
  }
});
content.addEventListener('change', event => {
  const { id, value } = event.target;
  const targets = {
    'filter-indicator': () => explorerLink(value, route.year),
    'filter-year': () => explorerLink(route.indicator, value),
    'detail-series': () => indicatorLink(value, route.year),
    'detail-year': () => indicatorLink(route.indicator, value)
  };
  if (Object.hasOwn(targets, id)) {
    const next = targets[id]();
    if (next !== location.hash) {
      retainFocus = id;
      location.hash = next;
    }
  }
});
content.addEventListener('click', event => {
  if (event.target.closest('#download')) downloadSelection();
});
window.addEventListener('hashchange', () => renderRoute(true));
renderRoute();
