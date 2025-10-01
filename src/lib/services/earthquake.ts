// Earthquake data service for fetching USGS data

import type { Earthquake, USGSResponse, TimeWindow, UserLocation, FeltIntensity } from '../types.js';
import { calculateDistance, calculateFeltIntensity, getIntensityLabel } from '../utils/distance.js';

const USGS_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

const TIME_WINDOW_URLS: Record<TimeWindow, string> = {
	'24h': `${USGS_BASE_URL}/all_day.geojson`,
	'7d': `${USGS_BASE_URL}/all_week.geojson`,
	'30d': `${USGS_BASE_URL}/all_month.geojson`
};

/**
 * Fetch earthquake data from USGS for the specified time window
 */
export async function fetchEarthquakeData(timeWindow: TimeWindow): Promise<Earthquake[]> {
	try {
		const response = await fetch(TIME_WINDOW_URLS[timeWindow]);
		
		if (!response.ok) {
			throw new Error(`Failed to fetch earthquake data: ${response.status} ${response.statusText}`);
		}
		
		const data: USGSResponse = await response.json();
		
		return data.features.map(feature => ({
			id: feature.id,
			magnitude: feature.properties.mag || 0,
			place: feature.properties.place || 'Unknown location',
			time: feature.properties.time,
			coordinates: feature.geometry.coordinates,
			url: feature.properties.url || ''
		}));
	} catch (error) {
		console.error('Error fetching earthquake data:', error);
		throw new Error('Failed to fetch earthquake data. Please check your internet connection.');
	}
}

/**
 * Calculate felt intensity for earthquakes at a specific location
 */
export function calculateFeltIntensities(
	earthquakes: Earthquake[],
	userLocation: UserLocation
): FeltIntensity[] {
	return earthquakes
		.map(earthquake => {
			const [lon, lat] = earthquake.coordinates;
			const distance = calculateDistance(
				userLocation.latitude,
				userLocation.longitude,
				lat,
				lon
			);
			
			const intensity = calculateFeltIntensity(earthquake.magnitude, distance);
			
			return {
				earthquake,
				distance,
				intensity,
				intensityLabel: getIntensityLabel(intensity)
			};
		})
		.sort((a, b) => b.intensity - a.intensity); // Sort by intensity descending
}

/**
 * Get earthquakes with felt intensity calculations for a location and time window
 */
export async function getEarthquakesForLocation(
	userLocation: UserLocation,
	timeWindow: TimeWindow = '24h'
): Promise<FeltIntensity[]> {
	const earthquakes = await fetchEarthquakeData(timeWindow);
	return calculateFeltIntensities(earthquakes, userLocation);
}
