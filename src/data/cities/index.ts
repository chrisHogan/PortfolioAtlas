import type { CityData, Region } from '../types';

// Import all city data files
// Southeast Asia
import chiangMai from './chiang-mai.json';
import bangkok from './bangkok.json';
import bali from './bali.json';
import kualaLumpur from './kuala-lumpur.json';
import hoChiMinhCity from './ho-chi-minh-city.json';
import daNang from './da-nang.json';
import georgeTown from './george-town.json';
import cebu from './cebu.json';

// Europe
import lisbon from './lisbon.json';
import porto from './porto.json';
import barcelona from './barcelona.json';
import athens from './athens.json';
import dubrovnik from './dubrovnik.json';
import budapest from './budapest.json';
import valencia from './valencia.json';
import chania from './chania.json';
import tbilisi from './tbilisi.json';

// Latin America
import mexicoCity from './mexico-city.json';
import medellin from './medellin.json';
import playaDelCarmen from './playa-del-carmen.json';
import buenosAires from './buenos-aires.json';
import montevideo from './montevideo.json';
import cuenca from './cuenca.json';
import panamaCity from './panama-city.json';
import sanJoseCR from './san-jose-cr.json';
import lakeChapala from './lake-chapala.json';

// North America
import austin from './austin.json';
import boise from './boise.json';
import asheville from './asheville.json';
import tucson from './tucson.json';
import sarasota from './sarasota.json';
import halifax from './halifax.json';
import kelowna from './kelowna.json';
import quebecCity from './quebec-city.json';
import tampa from './tampa.json';
import sanAntonio from './san-antonio.json';
import knoxville from './knoxville.json';
import madison from './madison.json';
import omaha from './omaha.json';
import desMoines from './des-moines.json';
import siouxFalls from './sioux-falls.json';
import raleigh from './raleigh.json';
import pittsburgh from './pittsburgh.json';
import chattanooga from './chattanooga.json';
import greenville from './greenville.json';
import albuquerque from './albuquerque.json';
import reno from './reno.json';
import fargo from './fargo.json';
import midlandMI from './midland-mi.json';

// Middle East
import dubai from './dubai.json';

export const allCities: CityData[] = [
  // Southeast Asia
  chiangMai,
  bangkok,
  bali,
  kualaLumpur,
  hoChiMinhCity,
  daNang,
  georgeTown,
  cebu,
  // Europe
  lisbon,
  porto,
  barcelona,
  athens,
  dubrovnik,
  budapest,
  valencia,
  chania,
  tbilisi,
  // Latin America
  mexicoCity,
  medellin,
  playaDelCarmen,
  buenosAires,
  montevideo,
  cuenca,
  panamaCity,
  sanJoseCR,
  lakeChapala,
  // North America
  austin,
  boise,
  asheville,
  tucson,
  sarasota,
  halifax,
  kelowna,
  quebecCity,
  tampa,
  sanAntonio,
  knoxville,
  madison,
  omaha,
  desMoines,
  siouxFalls,
  raleigh,
  pittsburgh,
  chattanooga,
  greenville,
  albuquerque,
  reno,
  fargo,
  midlandMI,
  // Middle East
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
