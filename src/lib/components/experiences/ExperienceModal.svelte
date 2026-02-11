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

	let previousBodyOverflow = '';
	let previousScrollerOverflow = '';

	let previousHtmlOverflow = '';
	let previousScrollerOverflow2 = '';

	function lockScroll() {
		if (typeof document === 'undefined') return;
		previousBodyOverflow = document.body.style.overflow;
		previousHtmlOverflow = document.documentElement.style.overflow;
		document.body.style.overflow = 'hidden';
		document.documentElement.style.overflow = 'hidden';
		const scroller = document.getElementById('portfolioScroller');
		if (scroller) {
			previousScrollerOverflow = scroller.style.overflow;
			previousScrollerOverflow2 = scroller.style.overflowY;
			scroller.style.overflow = 'hidden';
			scroller.style.overflowY = 'hidden';
		}
	}

	function unlockScroll() {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = previousBodyOverflow;
		document.documentElement.style.overflow = previousHtmlOverflow;
		const scroller = document.getElementById('portfolioScroller');
		if (scroller) {
			scroller.style.overflow = previousScrollerOverflow;
			scroller.style.overflowY = previousScrollerOverflow2;
		}
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
