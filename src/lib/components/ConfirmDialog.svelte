<script lang="ts">
	import { X } from 'lucide-svelte';

	// Props
	export let isOpen = false;
	export let title = '';
	export let message = '';
	export let confirmText = 'Confirm';
	export let cancelText = 'Cancel';
	export let onConfirm: () => void;
	export let onCancel: () => void;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onCancel();
		}
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onCancel();
		}
	}
</script>

{#if isOpen}
	<!-- Overlay -->
	<div
		class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
		on:click={handleOverlayClick}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Dialog -->
		<div
			class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
			role="document"
		>
			<!-- Close button -->
			<button
				on:click={onCancel}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
				aria-label="Close dialog"
			>
				<X class="h-5 w-5" />
			</button>

			<!-- Content -->
			<div class="mb-6">
				{#if title}
					<h2 class="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
				{/if}
				<p class="text-gray-600">{message}</p>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 justify-end">
				<button
					on:click={onCancel}
					class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
				>
					{cancelText}
				</button>
				<button
					on:click={onConfirm}
					class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
