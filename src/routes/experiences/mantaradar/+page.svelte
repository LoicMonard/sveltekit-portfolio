<script lang="ts">
	import Mantaradar from '$lib/components/experiences/Mantaradar.svelte';
  import { getExperienceByName } from '$lib/stores/experiences.store';

  const experience = getExperienceByName('Mantaradar');
</script>

<Mantaradar hasActionButton={false} isInFullPageMode data={experience}/>
