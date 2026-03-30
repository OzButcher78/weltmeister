import mapping from './mapping.json';

const manualMapping: Record<string, string> = {
  'Fiji': 'Oceania',
  'W. Sahara': 'Africa',
  'United States of America': 'North America',
  'Dem. Rep. Congo': 'Africa',
  'Dominican Rep.': 'North America',
  'Falkland Is.': 'South America',
  'Fr. S. Antarctic Lands': 'Antarctica',
  'Timor-Leste': 'Asia',
  "Côte d'Ivoire": 'Africa',
  'Central African Rep.': 'Africa',
  'Eq. Guinea': 'Africa',
  'eSwatini': 'Africa',
  'Solomon Is.': 'Oceania',
  'Taiwan': 'Asia',
  'Czechia': 'Europe',
  'N. Cyprus': 'Asia',
  'Somaliland': 'Africa',
  'Bosnia and Herz.': 'Europe',
  'Macedonia': 'Europe',
  'Kosovo': 'Europe',
  'S. Sudan': 'Africa',
  'Antarctica': 'Antarctica'
};

const continentToId: Record<string, string> = {
  'Asia': 'asia',
  'Europe': 'europe',
  'Africa': 'africa',
  'Oceania': 'oceania',
  'North America': 'na',
  'Antarctica': 'antarctica',
  'South America': 'sa'
};

export function getContinentId(countryName: string): string | null {
  let continentName = manualMapping[countryName];
  if (!continentName) {
    const found = mapping.find((m: any) => m.country === countryName);
    if (found) {
      continentName = found.continent;
    }
  }
  
  if (continentName) {
    return continentToId[continentName] || null;
  }
  return null;
}
