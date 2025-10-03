<script lang="ts">
	import BigCloud from '$lib/components/gsap/BigCloud.svelte';
	import BigCloud2 from './BigCloud2.svelte';
	import BigCloud3 from './BigCloud3.svelte';
	import BigCloud4 from './BigCloud4.svelte';
</script>

<div
	id="skyContainer"
	class="container absolute top-0 z-10 flex w-screen -translate-y-1/2 items-center"
>
	<BigCloud id="bigCloud1" class="cloud1" />
	<BigCloud2 id="bigCloud2" class="cloud2" />
	<BigCloud3 id="bigCloud3" class="cloud3" />
	<BigCloud4 id="bigCloud4" class="cloud4" />
</div>
