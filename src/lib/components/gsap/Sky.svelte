<script lang="ts">
	import BigCloud from '$lib/components/gsap/BigCloud.svelte';
	import BigCloud2 from './BigCloud2.svelte';
</script>

<div
	id="skyContainer"
	class="absolute top-0 z-10 flex w-screen container -translate-y-1/2 items-center"
>
	<BigCloud id="bigCloud1" class="cloud1" />
	<BigCloud2 id="bigCloud2" class="cloud2" />
</div>
