// Geolocation service for getting user's location

import type { UserLocation } from '../types.js';

/**
 * Get user's current location using the Geolocation API
 */
export async function getCurrentLocation(): Promise<UserLocation> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation is not supported by this browser'));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy
				});
			},
			(error) => {
				let message = 'Failed to get location';
				switch (error.code) {
					case error.PERMISSION_DENIED:
						message = 'Location access denied by user';
						break;
					case error.POSITION_UNAVAILABLE:
						message = 'Location information unavailable';
						break;
					case error.TIMEOUT:
						message = 'Location request timed out';
						break;
				}
				reject(new Error(message));
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000 // 5 minutes
			}
		);
	});
}

/**
 * Check if geolocation is available
 */
export function isGeolocationAvailable(): boolean {
	return typeof window !== 'undefined' && 'geolocation' in navigator;
}
