<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let isOpen = false;

	const dispatch = createEventDispatcher();

	let modalCardContainer: HTMLElement;

	export const getContainer = () => modalCardContainer;

	const handleClose = () => {
		dispatch('close');
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && isOpen) {
			handleClose();
		}
	};

	const preventScroll = (e: Event) => {
		if (modalCardContainer?.contains(e.target as Node)) return;
		e.preventDefault();
	};

	function lockScroll() {
		if (typeof window === 'undefined') return;
		window.addEventListener('wheel', preventScroll, { passive: false });
		window.addEventListener('touchmove', preventScroll, { passive: false });
	}

	function unlockScroll() {
		if (typeof window === 'undefined') return;
		window.removeEventListener('wheel', preventScroll);
		window.removeEventListener('touchmove', preventScroll);
	}

	$: if (isOpen) {
		lockScroll();
	} else {
		unlockScroll();
	}

	onDestroy(() => {
		unlockScroll();
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
		on:click={handleClose}
		on:keydown={() => {}}
	></div>
{/if}

<div
	bind:this={modalCardContainer}
	class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
	role="dialog"
	aria-modal="true"
	class:invisible={!isOpen}
>
	<div class="pointer-events-auto w-full max-w-4xl max-h-[90vh] h-full overscroll-contain">
		<!-- Card element will be moved here by GSAP Flip -->
	</div>
</div>
