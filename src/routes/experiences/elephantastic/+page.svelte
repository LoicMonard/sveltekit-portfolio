<script lang="ts">
	import Elephantastic from '$lib/components/experiences/Elephantastic.svelte';
  import { getExperienceByName } from '$lib/stores/experiences.store';

  const experience = getExperienceByName('Elephantastic');
</script>

<Elephantastic hasActionButton={false} isInFullPageMode data={experience}/>
