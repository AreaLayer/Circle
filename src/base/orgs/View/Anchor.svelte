<script lang="ts">
  import { ethers } from "ethers";
  import type { Org, Safe } from "@app/base/orgs/Org";
  import type { PendingProject } from "@app/project";
  import type { Session } from "@app/session";
  import type { Config } from "@app/config";
  import * as utils from "@app/utils";
  import Modal from "@app/Modal.svelte";

  export let safe: Safe; // Org safe.
  export let project: PendingProject;
  export let session: Session;
  export let config: Config;

  enum State {
    Idle,
    Confirm,
    Signing,
    Submitting,
    Success,
    Failed,
  }
  let state = State.Idle;

  const isSigned = project.confirmations.includes(
    ethers.utils.getAddress(session.address)
  );
  const close = () => (state = State.Idle);
  const pending = safe.threshold - project.confirmations.length;
  const confirmAnchor = async (safeTxHash: string) => {
    try {
      state = State.Signing;
      const signature = await utils.signSafeTransaction(safe.address, safeTxHash, config);

      state = State.Submitting;
      await config.safe.client?.confirmTransaction(safeTxHash, signature.data);

      state = State.Success;
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
  .table {
    display: grid;
    grid-template-columns: 5rem 4fr;
    grid-gap: 1rem;
    text-align: left;
  }
  .table > *:nth-child(odd) { /* Labels */
    color: var(--color-secondary);
  }
  .table > *:nth-child(even) { /* Values */
    display: flex;
    align-items: center;
    justify-content: left;
  }
</style>

<span class="confirmations">
  {#if pending > 0}
    <strong>{pending}</strong> signature(s) pending
  {/if}
</span>

<!-- Check whether or not we've signed this proposal -->
{#if !isSigned}
  <span class="badge safe no-margin">✓ signed</span>
{:else}
  <button on:click|stopPropagation={() => (state = State.Confirm)} class="tiny">
    Confirm
  </button>
{/if}

<!-- We've initiated an action -->
{#if state != State.Idle}
  <Modal floating>
    <span slot="title">
      <div>⚓</div>
      <div>Anchor project</div>
    </span>

    <span slot="subtitle">
      {#if state == State.Confirm}
      {:else if state == State.Signing}
        <span>Sign the transaction in your wallet...</span>
      {:else if state == State.Submitting}
        <span>Transaction is being confirmed...</span>
      {:else if state == State.Success}
        <span>Transaction confirmed.</span>
      {/if}
    </span>

    <span slot="body">
      {#if state == State.Confirm}
        <div class="table">
          <div>Project</div><code>{project.id}</code>
          <div>Hash</div><code>{project.anchor.stateHash}</code>
        </div>
      {/if}
    </span>

    <span slot="actions">
      {#if state == State.Confirm}
        <button class="primary">
          Confirm
        </button>
        <button class="text">
          Cancel
        </button>
      {:else if state == State.Success}
        <button on:click={close}>Done</button>
      {/if}
    </span>
  </Modal>
{/if}
