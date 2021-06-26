<script lang="ts">
  import type { Config } from "@app/config";
  import type { Org } from "@app/base/orgs/Org";
  import type { Session } from "@app/session";
  import Loading from "@app/Loading.svelte";
  import Message from "@app/Message.svelte";
  import Widget from '@app/base/projects/Widget.svelte';
  import Anchor from './Anchor.svelte';

  export let org: Org;
  export let config: Config;
  export let isMember: (org: Org) => Promise<boolean>;
  export let session: Session | null;

  const confirm = (safeTxHash: string) => {
    console.log("confirm", safeTxHash);
  };

  $: getProjects =
    isMember(org).then((result: boolean) => {
      if (result) {
        return org.getAllProjects(config);
      } else {
        return org.getProjects(config);
      }
    });
</script>

<style>
  .projects {
    margin-top: 2rem;
  }
  .projects .project {
    margin-bottom: 1rem;
  }
</style>

<div class="projects">
  {#await getProjects}
    <Loading center />
  {:then projects}
    {#each projects as project}
      <div class="project">
        {#if "safeTxHash" in project} <!-- Pending project -->
          <Widget {project} org={org.address} {config} faded>
            <span slot="actions">
              {#if org.safe && session}
                <Anchor {project} safe={org.safe} {session} />
              {/if}
            </span>
          </Widget>
        {:else} <!-- Anchored project -->
          <Widget {project} org={org.address} {config} />
        {/if}
      </div>
    {/each}
  {:catch err}
    <Message error>
      <strong>Error: </strong> failed to load projects: {err.message}.
    </Message>
  {/await}
</div>
