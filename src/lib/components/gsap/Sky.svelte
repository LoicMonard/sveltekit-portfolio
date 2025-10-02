<script lang="ts">
	import BigCloud from '$lib/components/gsap/BigCloud.svelte';
	import BigCloud2 from './BigCloud2.svelte';
</script>

<div id="skyContainer" class="absolute -translate-y-1/2 top-0 h-fit  flex z-10">
	<BigCloud class="cloud1" />
  <BigCloud2 class="cloud2" />
</div>
