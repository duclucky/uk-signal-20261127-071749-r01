// World Bank: World Development Indicators, GBR, 2015–2024 in ascending order.
// Extracted 27 November 2026. Figures are unchanged; labels are editorial.
export const country = 'United Kingdom';
export const firstYear = 2015;
export const lastYear = 2024;
export const years = Array.from({ length: 10 }, (_, index) => firstYear + index);
export const source = 'World Bank: World Development Indicators';
export const terms = 'https://www.worldbank.org/ext/en/legal/terms-conditions/datasets';
export const licence = 'https://creativecommons.org/licenses/by/4.0/';
export const definition = code => 'https://data.worldbank.org/indicator/' + code + '?locations=GB';

const accounts = 'National statistical organisations and central banks; OECD National Accounts; World Bank staff estimates';

export const indicators = [
  {
    id: 'population', code: 'SP.POP.TOTL', name: 'Population', group: 'People', kind: 'people',
    unit: 'people', shortUnit: 'Midyear residents', axis: 'Million people',
    provider: 'UN Population Division and Statistics Division; national statistical offices; Eurostat',
    explanation: 'An estimate of all UK residents at midyear, regardless of citizenship or legal status.',
    caution: 'These are national estimates. The series does not show where within the UK population changed.',
    values: [65087000, 65606000, 65964000, 66287000, 66628000, 66740000, 66978000, 67636000, 68526000, 69281000]
  },
  {
    id: 'gdp', code: 'NY.GDP.MKTP.CD', name: 'Nominal GDP', group: 'Economy', kind: 'total-usd',
    unit: 'current US$', shortUnit: 'Current US dollars', axis: 'Trillion current US$',
    provider: accounts,
    explanation: 'The value of production within the UK economy, measured at current prices and expressed in US dollars.',
    caution: 'Domestic prices and exchange rates can move this figure. For changes in output volume, use real GDP growth.',
    values: [2945579890258.46, 2706807606538.73, 2699118387873.1, 2897028009916.05, 2875710080015.3, 2724001478304.59, 3194559188925.93, 3181244350465.41, 3420796653789.08, 3695539513534.15]
  },
  {
    id: 'growth', code: 'NY.GDP.MKTP.KD.ZG', name: 'Real GDP growth', group: 'Economy', kind: 'rate',
    unit: 'annual %', shortUnit: 'Annual change in output', axis: 'Annual change (%)',
    provider: accounts,
    explanation: 'The change in GDP from the preceding year after removing price changes, using the WDI constant 2015 price series.',
    caution: 'A negative figure means real output shrank. The rate is not a dollar amount or the level of GDP.',
    values: [2.14040560033371, 2.20652020635357, 3.02322219840339, 1.55133095078786, 1.25629899760824, -10.047896637362, 8.5431118453255, 5.14970388522993, 0.271650048355255, 1.08027716858781]
  },
  {
    id: 'inflation', code: 'FP.CPI.TOTL.ZG', name: 'CPI inflation', group: 'Prices', kind: 'rate',
    unit: 'annual %', shortUnit: 'Annual consumer price change', axis: 'Annual change (%)',
    provider: 'IMF International Financial Statistics',
    explanation: 'The annual change in the price of a basket of goods and services bought by consumers.',
    caution: 'When inflation slows but remains above zero, prices are still rising on average, just more slowly.',
    values: [0.36804684232536, 1.00841736811409, 2.55775577557747, 2.29283990345937, 1.73810460086512, 0.989486703772491, 2.51837109614213, 7.92204883147902, 6.79396706793962, 3.2715729463592]
  },
  {
    id: 'per-capita', code: 'NY.GDP.PCAP.CD', name: 'GDP per person', group: 'Economy', kind: 'person-usd',
    unit: 'current US$ per person', shortUnit: 'Current US dollars per person', axis: 'Thousand current US$ per person',
    provider: accounts,
    explanation: 'Nominal GDP in US dollars divided by the UK population.',
    caution: 'This measures production per resident, not personal income or purchasing power.',
    values: [45256.040227057, 41258.5374285695, 40918.0520870944, 43704.3162296687, 43160.6843971799, 40815.1255364787, 47695.6491523474, 47034.7795621476, 49919.6896621586, 53341.3131094262]
  },
  {
    id: 'unemployment', code: 'SL.UEM.TOTL.ZS', name: 'Unemployment', group: 'Work', kind: 'rate',
    unit: '% of total labour force', shortUnit: 'Labour force · modelled ILO', axis: 'Share of labour force (%)',
    provider: 'ILO Modelled Estimates (ILOEST), ILOSTAT',
    explanation: 'The modelled ILO share of the total labour force that is out of work, available and looking for work.',
    caution: 'The denominator is the labour force, not all residents. This harmonised estimate can differ from the national unemployment series.',
    values: [5.552, 4.909, 4.501, 4.145, 3.657, 4.472, 4.864, 3.768, 4.025, 4.361]
  }
];
