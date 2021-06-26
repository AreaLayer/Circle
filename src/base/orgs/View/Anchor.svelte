<script lang="ts">
  import { ethers } from "ethers";
  import type { Org, Safe } from "@app/base/orgs/Org";
  import type { PendingProject } from "@app/project";
  import type { Session } from "@app/session";
  import type { Config } from "@app/config";
  import * as utils from "@app/utils";

  export let safe: Safe; // Org safe.
  export let project: PendingProject;
  export let session: Session;
  export let config: Config;

  enum State {
    Idle,
    Signing,
    Confirming,
    Confirmed,
    Failed,
  }

  let state = State.Idle;

  const pending = safe.threshold - project.confirmations.length;
  const confirm = async (safeTxHash: string) => {
    try {
      state = State.Signing;
      const signature = await utils.signSafeTransaction(safe.address, safeTxHash, config);
      state = State.Confirming;
      await config.safe.client?.confirmTransaction(safeTxHash, signature.data);
      state = State.Confirmed;
    } catch (err) {
      console.error(err);
      state = State.Failed;
    }
  };
</script>

<style>
  .confirmations {
    margin-right: 0.5rem;
  }
</style>

<span class="confirmations">
  {#if pending > 0}
    <strong>{pending}</strong> signature(s) pending
  {/if}
</span>

<!-- Check whether or not we've signed this proposal -->
{#if project.confirmations.includes(ethers.utils.getAddress(session.address))}
  <span class="badge safe no-margin">✓ signed</span>
{:else if state == State.Idle}
  <button on:click|stopPropagation={() => confirm(project.safeTxHash)} class="tiny">
    Confirm
  </button>
{:else if state == State.Signing}
  <!-- TODO: Should we use a modal instead? -->
{:else if state == State.Confirming}
  <!-- TODO: Should we use a modal instead? -->
{:else if state == State.Confirmed}
  <!-- TODO: Should we use a modal instead? -->
{/if}
