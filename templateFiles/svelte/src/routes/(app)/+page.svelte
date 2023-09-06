<script lang="ts">
  import TitleBar from '$lib/TitleBar/TitleBar.svelte';
  import Meta from '../../util/Meta/Meta.svelte';
</script>

<svelte:head>
  <Meta
    tags={{
      title: 'FakeGPT',
      description: 'A simple fake ChatGPT interface',
    }}
  />
</svelte:head>

<div class="conversation">
  <TitleBar>Blank Conversation</TitleBar>
  <div class="blank">
    Please select a conversation on the left.
    <p>
      Are you a developer using this template? Click <a href="/developers"
        >here</a
      >!
    </p>
  </div>
</div>

<style lang="scss">
  .conversation {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .blank {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-family: Roboto, system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
      font-size: 1.5rem;
      opacity: 0.8;
      p {
        font-size: 1rem;
        opacity: 0.5;
        text-align: center;
      }
    }
  }
</style>
