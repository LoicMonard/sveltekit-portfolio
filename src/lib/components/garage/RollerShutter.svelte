<script lang="ts">
	export let progress: number = 0;

	const PANEL_COUNT = 5;
	const panels = Array.from({ length: PANEL_COUNT });
</script>

<div class="absolute inset-0 overflow-hidden">
	<div
		class="absolute inset-x-0 top-0 flex h-full flex-col"
		style="transform: translateY(-{progress * 100}%)"
	>
		{#each panels as _, i}
			<div
				class="shutter-panel bg-white dark:bg-surface-dark"
				class:border-b={i < PANEL_COUNT - 1}
				class:border-neutral-200={i < PANEL_COUNT - 1}
				class:dark:border-neutral-900={i < PANEL_COUNT - 1}
			/>
		{/each}
	</div>
</div>

<style>
	.shutter-panel {
		width: 100%;
		flex: 1;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.15),
			inset 0 -1px 0 rgba(0, 0, 0, 0.06);
	}
</style>
