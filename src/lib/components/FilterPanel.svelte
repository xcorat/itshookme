<script lang="ts">
	import { Filter, X } from 'lucide-svelte';

	// Props
	export let minMagnitude = 0.0;
	export let maxMagnitude = 10.0;
	export let maxDistance = 100;
	export let displayLimit = 50;
	export let onFilterChange: (filters: {
		minMagnitude: number;
		maxMagnitude: number;
		maxDistance: number;
		displayLimit: number;
	}) => void;

	// Local state for inputs
	let localMinMag = minMagnitude;
	let localMaxMag = maxMagnitude;
	let localMaxDistance = maxDistance;
	let localDisplayLimit = displayLimit;

	// Distance options
	const distanceOptions = [10, 25, 50, 100, 250, 500];

	function applyFilters() {
		onFilterChange({
			minMagnitude: localMinMag,
			maxMagnitude: localMaxMag,
			maxDistance: localMaxDistance,
			displayLimit: localDisplayLimit
		});
	}

	function clearFilters() {
		localMinMag = 0.0;
		localMaxMag = 10.0;
		localMaxDistance = 100;
		localDisplayLimit = 50;
		applyFilters();
	}
</script>

<div class="bg-white rounded-lg shadow p-6">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold flex items-center gap-2">
			<Filter class="h-5 w-5" />
			Filters
		</h3>
	</div>

	<div class="space-y-4">
		<!-- Magnitude Range -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Magnitude Range
			</div>
			<div class="flex items-center gap-2">
				<input
					type="number"
					min="0"
					max="10"
					step="0.1"
					bind:value={localMinMag}
					class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<span class="text-gray-500">to</span>
				<input
					type="number"
					min="0"
					max="10"
					step="0.1"
					bind:value={localMaxMag}
					class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
		</div>

		<!-- Distance -->
		<div>
			<label for="distance-select" class="block text-sm font-medium text-gray-700 mb-2">
				Max Distance
			</label>
			<select
				id="distance-select"
				bind:value={localMaxDistance}
				class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{#each distanceOptions as distance}
					<option value={distance}>{distance} km</option>
				{/each}
			</select>
		</div>

		<!-- Display Limit -->
		<div>
			<label for="display-limit" class="block text-sm font-medium text-gray-700 mb-2">
				Display Limit
			</label>
			<input
				id="display-limit"
				type="number"
				min="10"
				max="200"
				step="10"
				bind:value={localDisplayLimit}
				class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<!-- Action Buttons -->
		<div class="flex gap-2 pt-2">
			<button
				on:click={applyFilters}
				class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
			>
				Apply
			</button>
			<button
				on:click={clearFilters}
				class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-1"
			>
				<X class="h-4 w-4" />
				Clear
			</button>
		</div>
	</div>
</div>
