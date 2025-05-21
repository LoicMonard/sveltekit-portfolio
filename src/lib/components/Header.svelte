<script lang="ts">
	import { Moon, SunMedium } from 'lucide-svelte';
	import { tick } from 'svelte';

	let animate = false;
	let phase = 0;
	let isDark = false;

	async function triggerAnimation() {
		animate = true;

		if (!isDark) {
			phase = 1;
			await tick();

			await new Promise((r) => setTimeout(r, 150));
			phase = 2;

			await new Promise((r) => setTimeout(r, 10));
			phase = 3;
		} else {
			phase = 4;
			await tick();

			await new Promise((r) => setTimeout(r, 150));
			phase = 5;

			await new Promise((r) => setTimeout(r, 10));
			phase = 0;
		}

		isDark = !isDark;
		animate = false;
	}
</script>

<header class="absolute left-0 top-0 z-20 h-fit w-full">
	<div class="container relative z-20 mx-auto flex items-center justify-between px-4 py-6">
		<br />
		<button
			type="button"
			on:click={triggerAnimation}
			class={`relative flex items-center gap-3 rounded-full border border-slate-300 bg-slate-50 p-2 transition-transform duration-150 ease-out dark:bg-slate-800 ${animate ? 'scale-[80%]' : 'scale-100'}`}
			aria-label="Toggle theme"
		>
			<div
				class="bubble absolute z-0 h-6 rounded-full bg-slate-700 transition-all"
				class:left-[0.25rem]={phase === 0 || phase === 1}
				class:right-[0.25rem]={phase === 2 || phase === 3 || phase === 4}
				style="
					width: {phase === 1 || phase === 2 || phase === 4 ? 'calc(100% - 1rem)' : '1.5rem'};
				"
			></div>
			<SunMedium
				class={`${isDark ? 'rotate-[75deg] text-slate-400' : 'text-white'} z-10 h-4 w-4 cursor-pointer transition-all duration-500`}
				strokeWidth={3}
			/>
			<Moon
				class={`${!isDark ? 'rotate-[360deg] text-slate-400' : 'text-white'} z-10 h-4 w-4 cursor-pointer transition-all duration-500`}
				strokeWidth={3}
			/>
		</button>
	</div>
</header>
