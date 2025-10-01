<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { UserLocation, FeltIntensity } from '../types.js';
	import ConfirmDialog from './ConfirmDialog.svelte';
	
	// Props
	export let location: UserLocation | null = null;
	export let earthquakes: FeltIntensity[] = [];
	export let onLocationSelect: ((location: UserLocation) => void) | null = null;
	export let height = '400px';
	export let showLocationConfirm = false; // Whether to show confirmation dialog on map click

	// Map container
	let mapContainer: HTMLDivElement;
	let map: any;
	let L: any;
	let userMarker: any;
	let earthquakeMarkers: any[] = [];
	
	// Dialog state
	let showDialog = false;
	let pendingLocation: UserLocation | null = null;

	onMount(async () => {
		// Only run in browser
		if (typeof window === 'undefined') return;
		
		// Dynamically import Leaflet to avoid SSR issues
		L = await import('leaflet');
		
		// Initialize map
		map = L.map(mapContainer).setView([39.8283, -98.5795], 4); // Center of US
		
		// Add tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		// Add click handler if location selection is enabled
		if (onLocationSelect) {
			map.on('click', (e: any) => {
				const { lat, lng } = e.latlng;
				const newLocation = {
					latitude: lat,
					longitude: lng
				};
				
				if (showLocationConfirm) {
					// Show confirmation dialog
					pendingLocation = newLocation;
					showDialog = true;
				} else {
					// Directly update location
					onLocationSelect(newLocation);
				}
			});
		}

		// Set initial location if provided
		if (location) {
			updateUserLocation();
		}

		// Add earthquake markers if provided
		if (earthquakes.length > 0) {
			updateEarthquakeMarkers();
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	function updateUserLocation() {
		if (!map || !L || !location) return;

		// Remove existing user marker
		if (userMarker) {
			map.removeLayer(userMarker);
		}

		// Add new user marker
		userMarker = L.marker([location.latitude, location.longitude], {
			icon: L.divIcon({
				html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
				className: 'user-location-marker',
				iconSize: [16, 16],
				iconAnchor: [8, 8]
			})
		}).addTo(map);

		userMarker.bindPopup('Your Location');

		// Center map on user location
		map.setView([location.latitude, location.longitude], Math.max(map.getZoom(), 8));
	}

	function updateEarthquakeMarkers() {
		if (!map || !L) return;

		// Remove existing earthquake markers
		earthquakeMarkers.forEach(marker => map.removeLayer(marker));
		earthquakeMarkers = [];

		// Add new earthquake markers
		earthquakes.forEach(({ earthquake, distance, intensity, intensityLabel }) => {
			const [lon, lat] = earthquake.coordinates;
			
			// Color based on intensity
			const color = getIntensityColor(intensityLabel);
			
			const marker = L.marker([lat, lon], {
				icon: L.divIcon({
					html: `<div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white" style="background-color: ${color};">${earthquake.magnitude.toFixed(1)}</div>`,
					className: 'earthquake-marker',
					iconSize: [24, 24],
					iconAnchor: [12, 12]
				})
			}).addTo(map);

			const popupContent = `
				<div class="p-2">
					<h3 class="font-semibold text-sm mb-1">M${earthquake.magnitude.toFixed(1)} Earthquake</h3>
					<p class="text-xs text-gray-600 mb-1">${earthquake.place}</p>
					<p class="text-xs mb-1">Distance: ${distance.toFixed(0)} km</p>
					<p class="text-xs mb-1">Felt Intensity: ${intensityLabel}</p>
					<p class="text-xs text-gray-500">${new Date(earthquake.time).toLocaleString()}</p>
				</div>
			`;

			marker.bindPopup(popupContent);
			earthquakeMarkers.push(marker);
		});
	}

	function getIntensityColor(intensityLabel: string): string {
		switch (intensityLabel) {
			case 'Weak': return '#10b981'; // green
			case 'Light': return '#f59e0b'; // yellow
			case 'Moderate': return '#f97316'; // orange
			case 'Strong': return '#ef4444'; // red
			case 'Very Strong': return '#7c2d12'; // dark red
			default: return '#6b7280'; // gray
		}
	}

	// Reactive updates (only in browser)
	$: if (typeof window !== 'undefined' && map && location) {
		updateUserLocation();
	}

	$: if (typeof window !== 'undefined' && map && earthquakes) {
		updateEarthquakeMarkers();
	}
	
	function handleConfirm() {
		if (pendingLocation && onLocationSelect) {
			onLocationSelect(pendingLocation);
		}
		showDialog = false;
		pendingLocation = null;
	}
	
	function handleCancel() {
		showDialog = false;
		pendingLocation = null;
	}
</script>

<div bind:this={mapContainer} style="height: {height}; width: 100%;" class="rounded-lg"></div>

<ConfirmDialog
	isOpen={showDialog}
	title="Update Location"
	message="Update earthquake list to show events near this location?"
	confirmText="Update List"
	cancelText="Cancel"
	onConfirm={handleConfirm}
	onCancel={handleCancel}
/>

<style>
	:global(.user-location-marker) {
		background: none !important;
		border: none !important;
	}
	
	:global(.earthquake-marker) {
		background: none !important;
		border: none !important;
	}
</style>
