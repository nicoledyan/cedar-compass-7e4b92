import type { HomeRecord, HomeScore, Risk } from './types';

export const HOME_STORAGE_KEY = 'cedar-compass:home-finder:v1';

export function addressFromZillowUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (!/(^|\.)zillow\.com$/i.test(url.hostname)) return '';
    const slug = url.pathname.match(/\/homedetails\/([^/]+)/i)?.[1];
    if (!slug) return '';
    return decodeURIComponent(slug).replace(/-\d+_zpid.*$/i, '').replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  } catch { return ''; }
}

export function validZillowUrl(value: string) {
  try { return /(^|\.)zillow\.com$/i.test(new URL(value.trim()).hostname); } catch { return false; }
}

export function blankHome(zillowUrl: string): HomeRecord {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), zillowUrl: zillowUrl.trim(), address: addressFromZillowUrl(zillowUrl) || 'Address not confirmed', createdAt: now, updatedAt: now, hoa: 'unknown', parking: 'unknown', wildfireRisk: 'unknown', floodRisk: 'unknown', mountainViews: 0, condition: 0, yard: 0, naturalLight: 0, layout: 0, neighborhoodFeel: 0, walkability: 0, safety: 0, noise: 0, amenities: 0, sunroom: false, screenedPorch: false, coveredPorch: false, showerWindow: false, notes: '' };
}

const ratingScore = (values: number[]) => {
  const known = values.filter((value) => value > 0);
  return known.length ? known.reduce((sum, value) => sum + value, 0) / known.length / 5 * 100 : 50;
};
const commuteScore = (minutes: Array<number | undefined>) => {
  const known = minutes.filter((value): value is number => typeof value === 'number' && value >= 0);
  if (!known.length) return 50;
  return Math.round(known.reduce((sum, value) => sum + Math.max(0, Math.min(100, 115 - value * 4.3)), 0) / known.length);
};
const riskPoints = (risk: Risk) => ({ unknown: 50, low: 100, moderate: 62, high: 22, 'very-high': 0 })[risk];

export function scoreHome(home: HomeRecord): HomeScore {
  const strengths: string[] = [], weaknesses: string[] = [], dealBreakers: string[] = [];
  if (home.price && home.price > 450000) dealBreakers.push('Above the $450,000 budget');
  else if (home.price && home.price <= 440000) strengths.push('Within the preferred price range');
  if (home.bedrooms !== undefined && home.bedrooms < 3) dealBreakers.push('Fewer than 3 bedrooms');
  if (home.bathrooms !== undefined && home.bathrooms < 1.5) dealBreakers.push('Fewer than 1.5 bathrooms');
  if (home.parking === 'street') dealBreakers.push('Street parking only');
  if (home.wildfireRisk === 'high' || home.wildfireRisk === 'very-high') dealBreakers.push(`${home.wildfireRisk === 'very-high' ? 'Very high' : 'High'} wildfire risk`);
  if (home.hoa === 'none') strengths.push('No HOA');
  if (home.mountainViews >= 4) strengths.push('Strong mountain-view potential');
  if (home.condition >= 4) strengths.push('Looks move-in ready');
  if (home.neighborhoodFeel >= 4) strengths.push('Established neighborhood feel');
  if (home.sunroom || home.screenedPorch || home.coveredPorch) strengths.push('Sheltered porch or sunroom');
  if (home.showerWindow) strengths.push('Window in the shower');
  if (home.wildfireRisk === 'low') strengths.push('Lower wildfire risk');
  if (home.mountainViews > 0 && home.mountainViews <= 2) weaknesses.push('Limited mountain views');
  if (home.condition > 0 && home.condition <= 2) weaknesses.push('Likely needs substantial updates');
  if (home.noise > 0 && home.noise <= 2) weaknesses.push('Possible noise concern');
  if (home.walkability > 0 && home.walkability <= 2) weaknesses.push('Limited walkability');
  if (home.hoa === 'small') weaknesses.push('Has an HOA');
  if (home.hoa === 'restrictive') weaknesses.push('Potentially restrictive HOA');

  let house = ratingScore([home.mountainViews, home.condition, home.yard, home.naturalLight, home.layout]);
  house += (home.sunroom || home.screenedPorch || home.coveredPorch) ? 5 : 0;
  house += home.showerWindow ? 2 : 0;
  house = Math.min(100, Math.round(house));
  const lifestyle = Math.round(ratingScore([home.neighborhoodFeel, home.walkability, home.safety, home.noise, home.amenities]));
  const commute = commuteScore([home.downtownMinutes, home.gardenMinutes, home.blackSheepMinutes, home.oldColoradoCityMinutes, home.redRockMinutes, home.manitouMinutes]);
  const risk = Math.round(riskPoints(home.wildfireRisk) * .75 + riskPoints(home.floodRisk) * .25);
  let overall = Math.round(lifestyle * .4 + house * .35 + commute * .15 + risk * .1);
  if (home.price && home.price > 450000) overall -= Math.min(18, Math.round((home.price - 450000) / 10000 * 2));
  if (home.hoa === 'small') overall -= 3;
  if (home.hoa === 'restrictive') overall -= 8;
  if (dealBreakers.length) overall = Math.min(overall, 59);
  overall = Math.max(0, Math.min(100, overall));

  const evidence = [home.price, home.bedrooms, home.bathrooms, home.hoa !== 'unknown', home.parking !== 'unknown', home.wildfireRisk !== 'unknown', home.floodRisk !== 'unknown', home.mountainViews, home.condition, home.yard, home.naturalLight, home.layout, home.neighborhoodFeel, home.walkability, home.safety, home.noise, home.amenities, home.downtownMinutes, home.gardenMinutes, home.blackSheepMinutes, home.oldColoradoCityMinutes, home.redRockMinutes, home.manitouMinutes];
  const confidence = Math.round(evidence.filter((value) => value !== undefined && value !== false && value !== 0).length / evidence.length * 100);
  return { overall, house, lifestyle, commute, risk, confidence, strengths: strengths.slice(0, 5), weaknesses: weaknesses.slice(0, 5), dealBreakers };
}
