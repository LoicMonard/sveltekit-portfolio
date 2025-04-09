<script>
	import Header from '$lib/components/Header.svelte';

	import '../app.css';
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="w-screen flex justify-center">
	<Header />
	<slot />
</div>
