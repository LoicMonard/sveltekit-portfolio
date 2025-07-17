<script lang="ts">
	export let data: {
		company: string;
		dateStart: Date;
		dateEnd: Date;
		skills: string[];
		icon: string;
		iconBgColor: string;
		shortDescription: string;
		component?: typeof import('svelte').SvelteComponent;
	};
</script>

{#if data?.component}
	<svelte:component this={data.component} {data} />
{:else}
	<p class="text-text-lightgray dark:text-text-darkgray">No component available for this item.</p>
{/if}
