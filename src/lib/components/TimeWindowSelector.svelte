<script lang="ts">
	import { Clock } from 'lucide-svelte';
	import type { TimeWindow } from '../types.js';

	// Props
	export let selectedWindow: TimeWindow = '24h';
	export let onWindowChange: (window: TimeWindow) => void;

	const timeWindows: { value: TimeWindow; label: string; description: string }[] = [
		{ value: '24h', label: '24 Hours', description: 'Past day' },
		{ value: '7d', label: '7 Days', description: 'Past week' },
		{ value: '30d', label: '30 Days', description: 'Past month' }
	];

	function handleChange(window: TimeWindow) {
		selectedWindow = window;
		onWindowChange(window);
	}
</script>

<div class="space-y-3">
	<h3 class="text-lg font-semibold flex items-center gap-2">
		<Clock class="h-5 w-5" />
		Time Window
	</h3>
	
	<div class="grid grid-cols-3 gap-2">
		{#each timeWindows as { value, label, description }}
			<button
				class="p-3 border rounded-lg text-center transition-all hover:bg-gray-50 {selectedWindow === value 
					? 'border-blue-500 bg-blue-50 text-blue-700' 
					: 'border-gray-200'}"
				on:click={() => handleChange(value)}
			>
				<div class="font-medium text-sm">{label}</div>
				<div class="text-xs text-gray-500 mt-1">{description}</div>
			</button>
		{/each}
	</div>
	
	<p class="text-sm text-gray-600">
		Select the time period for earthquake data. Larger windows show more earthquakes but may take longer to load.
	</p>
</div>
