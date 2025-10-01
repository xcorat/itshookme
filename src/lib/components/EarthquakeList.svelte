<script lang="ts">
	import { Activity, MapPin, Clock, ExternalLink } from 'lucide-svelte';
	import type { FeltIntensity } from '../types.js';

	// Props
	export let earthquakes: FeltIntensity[] = [];
	export let loading = false;

	function formatTime(timestamp: number): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) {
			return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
		} else if (diffHours > 0) {
			return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
		} else {
			const diffMinutes = Math.floor(diffMs / (1000 * 60));
			return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
		}
	}

	function getIntensityColor(intensityLabel: string): string {
		switch (intensityLabel) {
			case 'Weak': return 'text-green-600 bg-green-50 border-green-200';
			case 'Light': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'Moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
			case 'Strong': return 'text-red-600 bg-red-50 border-red-200';
			case 'Very Strong': return 'text-red-800 bg-red-100 border-red-300';
			default: return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold flex items-center gap-2">
		<Activity class="h-5 w-5" />
		Earthquakes by Felt Intensity
	</h3>

	{#if loading}
		<div class="space-y-3">
			{#each Array(5) as _}
				<div class="animate-pulse">
					<div class="h-24 bg-gray-200 rounded-lg"></div>
				</div>
			{/each}
		</div>
	{:else if earthquakes.length === 0}
		<div class="text-center py-8 text-gray-500">
			<Activity class="h-12 w-12 mx-auto mb-2 opacity-50" />
			<p>No earthquakes found for the selected time period.</p>
		</div>
	{:else}
		<div class="space-y-3 max-h-96 overflow-y-auto">
			{#each earthquakes as { earthquake, distance, intensity, intensityLabel }}
				<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
					<div class="flex items-start justify-between mb-2">
						<div class="flex-1">
							<h4 class="font-semibold text-gray-900">
								M{earthquake.magnitude.toFixed(1)} Earthquake
							</h4>
							<p class="text-sm text-gray-600 flex items-center gap-1 mt-1">
								<MapPin class="h-3 w-3" />
								{earthquake.place}
							</p>
						</div>
						
						<span class="px-2 py-1 text-xs font-medium rounded border {getIntensityColor(intensityLabel)}">
							{intensityLabel}
						</span>
					</div>

					<div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
						<div>
							<span class="font-medium">Distance:</span> {distance.toFixed(0)} km
						</div>
						<div>
							<span class="font-medium">Intensity:</span> {intensity.toFixed(1)}
						</div>
					</div>

					<div class="flex items-center justify-between text-xs text-gray-500">
						<div class="flex items-center gap-1">
							<Clock class="h-3 w-3" />
							{formatTime(earthquake.time)}
						</div>
						
						{#if earthquake.url}
							<a 
								href={earthquake.url} 
								target="_blank" 
								rel="noopener noreferrer"
								class="flex items-center gap-1 hover:text-blue-600 transition-colors"
							>
								<ExternalLink class="h-3 w-3" />
								Details
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<div class="text-sm text-gray-500 text-center">
			Showing {earthquakes.length} earthquake{earthquakes.length !== 1 ? 's' : ''} sorted by felt intensity
		</div>
	{/if}
</div>
