<script>
	import Header from '$lib/components/Header.svelte';

	import '../app.css';
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;700&display=swap"
		rel="stylesheet"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@160..700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex w-full justify-center overflow-hidden">
	<Header />
	<slot />
</div>
