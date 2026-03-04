import type { CityData, Region } from '../types';

// Import all city data files
// Southeast Asia
import chiangMai from './chiang-mai.json';
import bangkok from './bangkok.json';
import bali from './bali.json';
import kualaLumpur from './kuala-lumpur.json';
import hoChiMinhCity from './ho-chi-minh-city.json';

// Europe
import lisbon from './lisbon.json';
import porto from './porto.json';
import barcelona from './barcelona.json';
import athens from './athens.json';
import dubrovnik from './dubrovnik.json';
import budapest from './budapest.json';

// Latin America
import mexicoCity from './mexico-city.json';
import medellin from './medellin.json';
import playaDelCarmen from './playa-del-carmen.json';
import buenosAires from './buenos-aires.json';
import montevideo from './montevideo.json';

// North America
import austin from './austin.json';
import boise from './boise.json';
import asheville from './asheville.json';
import tucson from './tucson.json';
import sarasota from './sarasota.json';
import halifax from './halifax.json';
import kelowna from './kelowna.json';
import quebecCity from './quebec-city.json';

// Middle East
import dubai from './dubai.json';

export const allCities: CityData[] = [
  chiangMai,
  bangkok,
  bali,
  kualaLumpur,
  hoChiMinhCity,
  lisbon,
  porto,
  barcelona,
  athens,
  dubrovnik,
  budapest,
  mexicoCity,
  medellin,
  playaDelCarmen,
  buenosAires,
  montevideo,
  austin,
  boise,
  asheville,
  tucson,
  sarasota,
  halifax,
  kelowna,
  quebecCity,
  dubai,
] as CityData[];

export function getCityBySlug(slug: string): CityData | undefined {
  return allCities.find((city) => city.slug === slug);
}

export function getCitiesByRegion(region: Region): CityData[] {
  return allCities.filter((city) => city.region === region);
}

export function getAllSlugs(): string[] {
  return allCities.map((city) => city.slug);
}
