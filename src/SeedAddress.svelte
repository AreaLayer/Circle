<script lang="ts">
  import { formatSeedAddress, formatSeedId } from "@app/utils";
  import type { Config } from "@app/config";
  import type { Seed } from "@app/base/seeds/Seed";
  import Clipboard from "@app/Clipboard.svelte";

  export let seed: Seed;
  export let config: Config;
  export let full = false;

  const hostname = seed.host.host;
  const linkPort = config.seed.link.port;
</script>

<style>
  .seed-address {
    display: inline-flex;
    font-size: 1rem;
    line-height: 2rem;
    color: var(--color-foreground-90);
    vertical-align: middle;
  }
  .seed-icon {
    width: 1rem;
    margin-right: 0.5rem;
  }
  .seed-address > * {
    vertical-align: middle;
  }
</style>

<div>
  <div class="seed-address">
    <span class="seed-icon">{seed.emoji}</span>
    {#if full}
      <span><a href={seed.path} class="link">{formatSeedId(seed.id)}@{hostname}</a></span>
      <span class="faded">:{linkPort}</span>
    {:else}
      <span><a href={seed.path} class="link">{seed.host.host}</a></span>
    {/if}
  </div>
  <Clipboard small text={full ? formatSeedAddress(seed.id, hostname, linkPort) : hostname} />
</div>
<div class="desktop"/>
