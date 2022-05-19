<script lang="ts">
  import { Route } from "svelte-routing";
  import View from '@app/base/seeds/View.svelte';
  import type { Config } from '@app/config';

  export let config: Config;
</script>

<Route path="/seeds/:seed" let:params>
  <View {config} host={params.seed}/>
</Route>

<Route path="/seeds/:seed/:port" let:params>
  <View {config} host={params.seed} port={Number(params.port)} />
</Route>
