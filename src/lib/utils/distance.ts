// Distance calculation utilities using Haversine formula

/**
 * Calculate the great circle distance between two points on Earth
 * using the Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371; // Earth's radius in kilometers
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);
	
	const a = 
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	
	return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}

/**
 * Calculate felt intensity based on earthquake magnitude and distance
 * Using a simplified attenuation model for MVP
 * @param magnitude Earthquake magnitude
 * @param distance Distance from earthquake epicenter in km
 * @returns Intensity value (0-10 scale)
 */
export function calculateFeltIntensity(magnitude: number, distance: number): number {
	// Simplified attenuation formula: I = M - 3*log10(distance) - 3
	// Where I is intensity, M is magnitude
	// Clamped between 0 and 10
	const intensity = magnitude - 3 * Math.log10(Math.max(distance, 1)) - 3;
	return Math.max(0, Math.min(10, intensity));
}

/**
 * Convert numeric intensity to descriptive label
 * @param intensity Numeric intensity (0-10)
 * @returns Descriptive intensity label
 */
export function getIntensityLabel(intensity: number): 'Weak' | 'Light' | 'Moderate' | 'Strong' | 'Very Strong' {
	if (intensity < 2) return 'Weak';
	if (intensity < 4) return 'Light';
	if (intensity < 6) return 'Moderate';
	if (intensity < 8) return 'Strong';
	return 'Very Strong';
}
