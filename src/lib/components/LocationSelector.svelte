<script lang="ts">
	import { onMount } from 'svelte';
	import { MapPin, Loader2 } from 'lucide-svelte';
	import type { UserLocation } from '../types.js';
	import { getCurrentLocation, isGeolocationAvailable } from '../services/geolocation.js';
	import MapComponent from './MapComponent.svelte';

	// Props
	export let location: UserLocation | null = null;
	export let onLocationChange: (location: UserLocation) => void;

	// State
	let loading = false;
	let error = '';
	let showMap = false;

	// Try to get user's location on mount
	onMount(async () => {
		// Always show map first
		showMap = true;
		
		// Then try geolocation if available and no location set
		if (isGeolocationAvailable() && !location) {
			await requestLocation();
		}
	});

	async function requestLocation() {
		loading = true;
		error = '';
		
		try {
			const userLocation = await getCurrentLocation();
			location = userLocation;
			onLocationChange(userLocation);
			showMap = true;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to get location';
			showMap = true;
		} finally {
			loading = false;
		}
	}

	function handleMapClick(newLocation: UserLocation) {
		location = newLocation;
		onLocationChange(newLocation);
	}
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold flex items-center gap-2">
			<MapPin class="h-5 w-5" />
			Your Location
		</h2>
		
		{#if showMap && isGeolocationAvailable() && !loading}
			<button
				class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				on:click={requestLocation}
			>
				Use Current Location
			</button>
		{/if}
	</div>

	{#if loading}
		<div class="flex items-center gap-2 text-gray-600">
			<Loader2 class="h-4 w-4 animate-spin" />
			Getting your location...
		</div>
	{/if}

	{#if error}
		<div class="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
			{error}
		</div>
	{/if}

	{#if location}
		<div class="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
			Location set: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
			{#if location.accuracy}
				(±{Math.round(location.accuracy)}m)
			{/if}
		</div>
	{/if}

	{#if showMap}
		<div class="border rounded-lg overflow-hidden">
			<MapComponent 
				{location} 
				onLocationSelect={handleMapClick}
				height="300px"
			/>
		</div>
		<p class="text-sm text-gray-600">
			Click on the map to set your location for earthquake intensity calculations.
		</p>
	{/if}
</div>
