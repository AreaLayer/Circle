<script lang="ts">
  import Loading from "@app/Loading.svelte";
  import { Patch, Project } from "@app/project";
  import { formatCommit, formatSeedId } from "@app/utils";

  export let project: Project;

  const tagPrefix = "radicle-patch";

  const getBranchName = (patch: Patch) => {
    return patch.mergeBase === project.head ? project.defaultBranch : formatCommit(patch.mergeBase);
  };

  const removeTagPrefix = (tag: string): string => {
    return tag.replace(`${tagPrefix}/`, "");
  };
</script>

<style>
  .patches {
    padding: 0 2rem 0 8rem;
    font-size: 0.875rem;
  }
  .patch {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-foreground-background);
    min-height: 42px;
    margin-bottom: 1rem;
    padding: 0.5rem 0rem;
  }
  .description {
    padding-left: 1rem;
  }
  .patch:hover {
    background-color: var(--color-foreground-background-lighter);
    cursor: pointer;
  }
  .patch:not(:last-child) {
    border-bottom: 1px dashed var(--color-background);
  }
  .patch:first-child {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
  .patch:last-child {
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  .committer {
    color: var(--color-foreground);
    white-space: nowrap;
  }

  .authorship {
    display: flex;
    align-items: center;
    color: var(--color-foreground-faded);
    padding: 0.125rem 0;
  }

  @media (max-width: 960px) {
    .patches {
      padding-left: 2rem;
    }
  }
</style>

{#await Project.getPatches(project.urn, project.seed.api)}
  <Loading center />
{:then patches}
  <div class="patches">
    {#each patches as patch}
      <div class="patch">
        <div class="left description">
          <div>
            {patch.message}
          </div>
          {#if patch.peer?.person?.name}
            <div class="authorship committer">
              Opened by {patch.peer.person.name}
            </div>
          {:else}
            <div class="authorship committer subtle">
              Not able to retrieve authorship
            </div>
          {/if}
        </div>
        <div class="right">
          <span class="badge primary">
            {getBranchName(patch)}
          </span>
          <span>
            ←
          </span>
          <span class="badge primary">
            {formatSeedId(patch.peer.id)}/{removeTagPrefix(patch.id)}
          </span>
        </div>
      </div>
    {/each}
  </div>
{/await}
