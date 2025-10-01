<script lang="ts">
	import { onMount } from 'svelte';
	import { Activity, Map, List, RefreshCw } from 'lucide-svelte';
	import LocationSelector from '$lib/components/LocationSelector.svelte';
	import TimeWindowSelector from '$lib/components/TimeWindowSelector.svelte';
	import EarthquakeList from '$lib/components/EarthquakeList.svelte';
	import MapComponent from '$lib/components/MapComponent.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';
	import { getEarthquakesForLocation } from '$lib/services/earthquake.js';
	import type { UserLocation, FeltIntensity, TimeWindow } from '$lib/types.js';

	// State
	let userLocation: UserLocation | null = null;
	let selectedTimeWindow: TimeWindow = '24h';
	let earthquakes: FeltIntensity[] = [];
	let filteredEarthquakes: FeltIntensity[] = [];
	let loading = false;
	let error = '';
	let currentView: 'list' | 'map' = 'list';
	let isRefreshing = false;
	
	// Filter state
	let minMagnitude = 0.0;
	let maxMagnitude = 10.0;
	let maxDistance = 100;
	let displayLimit = 50;

	// Load earthquake data when location or time window changes
	$: if (userLocation && selectedTimeWindow) {
		loadEarthquakeData();
	}
	
	// Apply filters when earthquakes or filter settings change
	$: {
		filteredEarthquakes = earthquakes
			.filter(e => 
				e.earthquake.magnitude >= minMagnitude &&
				e.earthquake.magnitude <= maxMagnitude &&
				e.distance <= maxDistance
			)
			.slice(0, displayLimit);
	}

	async function loadEarthquakeData() {
		if (!userLocation) return;
		
		loading = true;
		error = '';
		
		try {
			earthquakes = await getEarthquakesForLocation(userLocation, selectedTimeWindow);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load earthquake data';
			console.error('Error loading earthquake data:', err);
		} finally {
			loading = false;
		}
	}

	function handleLocationChange(location: UserLocation) {
		userLocation = location;
	}

	function handleTimeWindowChange(timeWindow: TimeWindow) {
		selectedTimeWindow = timeWindow;
	}
	
	async function handleRefresh() {
		if (!userLocation || isRefreshing) return;
		isRefreshing = true;
		await loadEarthquakeData();
		isRefreshing = false;
	}
	
	function handleFilterChange(filters: {
		minMagnitude: number;
		maxMagnitude: number;
		maxDistance: number;
		displayLimit: number;
	}) {
		minMagnitude = filters.minMagnitude;
		maxMagnitude = filters.maxMagnitude;
		maxDistance = filters.maxDistance;
		displayLimit = filters.displayLimit;
	}
</script>

<svelte:head>
	<title>ItsHookMe - Earthquake Felt Intensity Monitor</title>
	<meta name="description" content="Monitor earthquakes by felt intensity at your location" />
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Activity class="h-8 w-8 text-blue-600" />
					<div>
						<h1 class="text-2xl font-bold text-gray-900">ItsHookMe</h1>
						<p class="text-sm text-gray-600">Earthquake Felt Intensity Monitor</p>
					</div>
				</div>
				
				{#if earthquakes.length > 0}
					<div class="flex items-center gap-2">
						<button
							class="px-3 py-2 text-sm rounded-lg transition-colors {currentView === 'list' 
								? 'bg-blue-100 text-blue-700' 
								: 'text-gray-600 hover:bg-gray-100'}"
							on:click={() => currentView = 'list'}
						>
							<List class="h-4 w-4" />
						</button>
						<button
							class="px-3 py-2 text-sm rounded-lg transition-colors {currentView === 'map' 
								? 'bg-blue-100 text-blue-700' 
								: 'text-gray-600 hover:bg-gray-100'}"
							on:click={() => currentView = 'map'}
						>
							<Map class="h-4 w-4" />
						</button>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Left Sidebar - Controls -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Location Selector -->
				<div class="bg-white rounded-lg shadow p-6">
					<LocationSelector 
						location={userLocation} 
						onLocationChange={handleLocationChange} 
					/>
				</div>

				<!-- Time Window Selector -->
				{#if userLocation}
					<div class="bg-white rounded-lg shadow p-6">
						<TimeWindowSelector 
							selectedWindow={selectedTimeWindow}
							onWindowChange={handleTimeWindowChange}
						/>
					</div>
				{/if}
				
				<!-- Filters -->
				{#if earthquakes.length > 0}
					<FilterPanel
						{minMagnitude}
						{maxMagnitude}
						{maxDistance}
						{displayLimit}
						onFilterChange={handleFilterChange}
					/>
				{/if}

				<!-- Stats -->
				{#if filteredEarthquakes.length > 0}
					<div class="bg-white rounded-lg shadow p-6">
						<h3 class="text-lg font-semibold mb-3">Summary</h3>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600">Total Found:</span>
								<span class="font-medium">{earthquakes.length}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Displayed:</span>
								<span class="font-medium">{filteredEarthquakes.length}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Strongest Felt:</span>
								<span class="font-medium">{filteredEarthquakes[0]?.intensityLabel || 'None'}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Closest Distance:</span>
								<span class="font-medium">{filteredEarthquakes.length > 0 ? Math.min(...filteredEarthquakes.map(e => e.distance)).toFixed(0) + ' km' : 'N/A'}</span>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Right Content - Data Display -->
			<div class="lg:col-span-2">
				{#if !userLocation}
					<div class="bg-white rounded-lg shadow p-8 text-center">
						<Activity class="h-16 w-16 mx-auto mb-4 text-gray-400" />
						<h2 class="text-xl font-semibold text-gray-900 mb-2">Welcome to ItsHookMe</h2>
						<p class="text-gray-600 mb-4">
							Discover how earthquakes would feel at your location. Set your location to get started.
						</p>
						<div class="text-sm text-gray-500">
							<p>• View earthquakes ranked by felt intensity</p>
							<p>• Choose from 24 hours, 7 days, or 30 days of data</p>
							<p>• See both list and map views</p>
						</div>
					</div>
				{:else if error}
					<div class="bg-white rounded-lg shadow p-8">
						<div class="text-center">
							<div class="text-red-500 mb-4">
								<Activity class="h-16 w-16 mx-auto" />
							</div>
							<h2 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
							<p class="text-red-600 mb-4">{error}</p>
							<button 
								class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
								on:click={loadEarthquakeData}
							>
								Try Again
							</button>
						</div>
					</div>
				{:else}
					<div class="bg-white rounded-lg shadow">
						{#if currentView === 'list'}
							<div class="p-6">
								<div class="flex items-center justify-between mb-4">
									<h3 class="text-lg font-semibold flex items-center gap-2">
										<List class="h-5 w-5" />
										Earthquake List
									</h3>
									<button
										on:click={handleRefresh}
										disabled={isRefreshing}
										class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										aria-label="Refresh earthquake data"
									>
										<RefreshCw class="h-5 w-5 {isRefreshing ? 'animate-spin' : ''}" />
									</button>
								</div>
								<EarthquakeList earthquakes={filteredEarthquakes} {loading} />
							</div>
						{:else}
							<div class="p-6">
								<div class="flex items-center justify-between mb-4">
									<h3 class="text-lg font-semibold flex items-center gap-2">
										<Map class="h-5 w-5" />
										Earthquake Map
									</h3>
									<button
										on:click={handleRefresh}
										disabled={isRefreshing}
										class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										aria-label="Refresh earthquake data"
									>
										<RefreshCw class="h-5 w-5 {isRefreshing ? 'animate-spin' : ''}" />
									</button>
								</div>
								<MapComponent 
									location={userLocation} 
									earthquakes={filteredEarthquakes}
									onLocationSelect={handleLocationChange}
									showLocationConfirm={true}
									height="500px"
								/>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="bg-white border-t mt-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="text-center text-sm text-gray-500">
				<p>Earthquake data provided by <a href="https://earthquake.usgs.gov/" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">USGS</a></p>
				<p class="mt-1">Built with Svelte 5 • Intensity calculations are estimates for educational purposes</p>
			</div>
		</div>
	</footer>
</div>
