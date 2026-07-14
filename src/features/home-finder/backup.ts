import type { HomeRecord, Hoa, Parking, Risk } from './types';

export interface HomeFinderBackup {
  app: 'cedar-compass-home-finder';
  version: 1;
  exportedAt: string;
  homes: HomeRecord[];
}

const risks: Risk[] = ['unknown', 'low', 'moderate', 'high', 'very-high'];
const parkingOptions: Parking[] = ['unknown', 'garage', 'driveway', 'street'];
const hoaOptions: Hoa[] = ['unknown', 'none', 'small', 'restrictive'];
const ratingKeys = ['mountainViews', 'condition', 'yard', 'naturalLight', 'layout', 'neighborhoodFeel', 'walkability', 'safety', 'noise', 'amenities'] as const;
const optionalNumberKeys = ['price', 'bedrooms', 'bathrooms', 'downtownMinutes', 'gardenMinutes', 'blackSheepMinutes', 'oldColoradoCityMinutes', 'redRockMinutes', 'manitouMinutes'] as const;
const booleanKeys = ['sunroom', 'screenedPorch', 'coveredPorch', 'showerWindow'] as const;

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const validDate = (value: unknown) => typeof value === 'string' && !Number.isNaN(Date.parse(value));

function normalizeHome(value: unknown, index: number): HomeRecord {
  if (!isObject(value)) throw new Error(`Home ${index + 1} is not a valid record.`);
  if (typeof value.id !== 'string' || !value.id.trim()) throw new Error(`Home ${index + 1} is missing an ID.`);
  if (typeof value.zillowUrl !== 'string' || !value.zillowUrl.trim()) throw new Error(`Home ${index + 1} is missing its Zillow URL.`);
  if (typeof value.address !== 'string') throw new Error(`Home ${index + 1} is missing its address.`);
  if (!validDate(value.createdAt) || !validDate(value.updatedAt)) throw new Error(`Home ${index + 1} has invalid dates.`);
  if (!hoaOptions.includes(value.hoa as Hoa) || !parkingOptions.includes(value.parking as Parking)) throw new Error(`Home ${index + 1} has invalid HOA or parking data.`);
  if (!risks.includes(value.wildfireRisk as Risk) || !risks.includes(value.floodRisk as Risk)) throw new Error(`Home ${index + 1} has invalid risk data.`);

  const home = { ...value } as unknown as HomeRecord;
  for (const key of ratingKeys) {
    if (typeof home[key] !== 'number' || !Number.isInteger(home[key]) || home[key] < 0 || home[key] > 5) throw new Error(`Home ${index + 1} has an invalid rating.`);
  }
  for (const key of optionalNumberKeys) {
    const number = home[key];
    if (number !== undefined && (typeof number !== 'number' || !Number.isFinite(number) || number < 0)) throw new Error(`Home ${index + 1} has invalid numeric data.`);
  }
  for (const key of booleanKeys) if (typeof home[key] !== 'boolean') throw new Error(`Home ${index + 1} has invalid feature data.`);
  if (typeof home.notes !== 'string') throw new Error(`Home ${index + 1} has invalid notes.`);
  if (home.listingDescription !== undefined && typeof home.listingDescription !== 'string') throw new Error(`Home ${index + 1} has an invalid listing description.`);
  return home;
}

export function createBackup(homes: HomeRecord[]): HomeFinderBackup {
  return { app: 'cedar-compass-home-finder', version: 1, exportedAt: new Date().toISOString(), homes };
}

export function parseBackup(text: string): HomeRecord[] {
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error('That file is not valid JSON.'); }
  if (!isObject(value) || value.app !== 'cedar-compass-home-finder' || value.version !== 1 || !Array.isArray(value.homes)) throw new Error('Choose a Home Finder JSON backup created by Cedar Compass.');
  const homes = value.homes.map(normalizeHome);
  const ids = new Set(homes.map((home) => home.id));
  if (ids.size !== homes.length) throw new Error('The backup contains duplicate home IDs.');
  return homes;
}

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export function exportJson(homes: HomeRecord[]) {
  download(`home-finder-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(createBackup(homes), null, 2), 'application/json');
}

export function exportCsv(homes: HomeRecord[]) {
  const keys: (keyof HomeRecord)[] = ['address', 'zillowUrl', 'price', 'bedrooms', 'bathrooms', 'hoa', 'parking', 'wildfireRisk', 'floodRisk', ...ratingKeys, ...optionalNumberKeys.slice(3), ...booleanKeys, 'listingDescription', 'notes', 'createdAt', 'updatedAt'];
  const rows = [keys.map(csvCell).join(','), ...homes.map((home) => keys.map((key) => csvCell(home[key])).join(','))];
  download(`home-finder-homes-${new Date().toISOString().slice(0, 10)}.csv`, rows.join('\n'), 'text/csv;charset=utf-8');
}
