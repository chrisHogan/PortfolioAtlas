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
import singapore from './singapore.json';

// East Asia
import tokyo from './tokyo.json';
import seoul from './seoul.json';
import taipei from './taipei.json';
import hongKong from './hong-kong.json';

// South Asia
import goa from './goa.json';
import colombo from './colombo.json';
import kathmandu from './kathmandu.json';
import delhi from './delhi.json';

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
import paris from './paris.json';
import london from './london.json';
import amsterdam from './amsterdam.json';
import prague from './prague.json';
import split from './split.json';
import tallinn from './tallinn.json';
import malaga from './malaga.json';
import nice from './nice.json';
import rome from './rome.json';
import edinburgh from './edinburgh.json';

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
import cartagena from './cartagena.json';
import quito from './quito.json';
import santiago from './santiago.json';

// Caribbean
import sanJuan from './san-juan.json';
import barbados from './barbados.json';
import cozumel from './cozumel.json';

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
import seattle from './seattle.json';
import newYork from './new-york.json';
import losAngeles from './los-angeles.json';
import chicago from './chicago.json';
import miami from './miami.json';
import sanFrancisco from './san-francisco.json';
import denver from './denver.json';
import victoria from './victoria.json';
import sanDiego from './san-diego.json';
import portland from './portland.json';
import boston from './boston.json';
import honolulu from './honolulu.json';
import charleston from './charleston.json';
import savannah from './savannah.json';
import nashville from './nashville.json';
import scottsdale from './scottsdale.json';
import washingtonDC from './washington-dc.json';
import philadelphia from './philadelphia.json';
import minneapolis from './minneapolis.json';
import saltLakeCity from './salt-lake-city.json';
import lasVegas from './las-vegas.json';
import charlotte from './charlotte.json';
import jacksonville from './jacksonville.json';
import santaFe from './santa-fe.json';
import fortWorth from './fort-worth.json';
import sanJoseCA from './san-jose-ca.json';

// Oceania
import sydney from './sydney.json';
import melbourne from './melbourne.json';
import auckland from './auckland.json';

// Middle East
import dubai from './dubai.json';
import muscat from './muscat.json';
import amman from './amman.json';

// Africa
import capeTown from './cape-town.json';
import marrakech from './marrakech.json';
import nairobi from './nairobi.json';
import accra from './accra.json';
import tunis from './tunis.json';

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
  singapore,
  // East Asia
  tokyo,
  seoul,
  taipei,
  hongKong,
  // South Asia
  goa,
  colombo,
  kathmandu,
  delhi,
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
  paris,
  london,
  amsterdam,
  prague,
  split,
  tallinn,
  malaga,
  nice,
  rome,
  edinburgh,
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
  cartagena,
  quito,
  santiago,
  // Caribbean
  sanJuan,
  barbados,
  cozumel,
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
  seattle,
  newYork,
  losAngeles,
  chicago,
  miami,
  sanFrancisco,
  denver,
  victoria,
  sanDiego,
  portland,
  boston,
  honolulu,
  charleston,
  savannah,
  nashville,
  scottsdale,
  washingtonDC,
  philadelphia,
  minneapolis,
  saltLakeCity,
  lasVegas,
  charlotte,
  jacksonville,
  santaFe,
  fortWorth,
  sanJoseCA,
  // Oceania
  sydney,
  melbourne,
  auckland,
  // Middle East
  dubai,
  muscat,
  amman,
  // Africa
  capeTown,
  marrakech,
  nairobi,
  accra,
  tunis,
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
